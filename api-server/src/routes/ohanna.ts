import { Router, type Request, type Response } from "express";
import { randomUUID } from "crypto";
import { asyncHandler } from "../middlewares";
import { productQueries, orderQueries, contactQueries } from "../db/queries";
import { logger } from "../lib/logger";

const router = Router();

// In-memory fallback storage when database is not available
const inMemoryContacts: any[] = [];
const inMemoryOrders: any[] = [];

/**
 * Helper to ensure string value (handle Express params that can be string or string[])
 */
function ensureString(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

/**
 * Products endpoints
 */
router.get(
  "/products",
  asyncHandler(async (_req: Request, res: Response) => {
    try {
      const allProducts = await productQueries.getAll();
      res.json({ products: allProducts });
    } catch (err) {
      logger.warn("Database unavailable, returning empty products");
      res.json({ products: [] });
    }
  })
);

router.get(
  "/products/:id",
  asyncHandler(async (req: Request, res: Response) => {
    try {
      const id = ensureString(req.params.id);
      if (!id) {
        res.status(400).json({ error: "Product ID is required" });
        return;
      }

      // Try to get by ID first, then by slug
      let product = await productQueries.getById(id);
      if (!product) {
        product = await productQueries.getBySlug(id);
      }

      if (!product) {
        res.status(404).json({ error: "Product not found" });
        return;
      }
      res.json(product);
    } catch (err) {
      logger.warn("Database unavailable for product lookup");
      res.status(404).json({ error: "Product not found" });
    }
  })
);

router.get(
  "/products/category/:category",
  asyncHandler(async (req: Request, res: Response) => {
    try {
      const category = ensureString(req.params.category);
      if (!category) {
        res.status(400).json({ error: "Category is required" });
        return;
      }

      const categoryProducts = await productQueries.getByCategory(category);
      res.json({ products: categoryProducts });
    } catch (err) {
      logger.warn("Database unavailable, returning empty products");
      res.json({ products: [] });
    }
  })
);

router.get(
  "/products/search/:query",
  asyncHandler(async (req: Request, res: Response) => {
    try {
      const query = ensureString(req.params.query);
      if (!query) {
        res.status(400).json({ error: "Search query is required" });
        return;
      }

      const searchResults = await productQueries.search(query);
      res.json({ products: searchResults });
    } catch (err) {
      logger.warn("Database unavailable for search");
      res.json({ products: [] });
    }
  })
);

/**
 * Checkout endpoint
 */
router.post(
  "/checkout",
  asyncHandler(async (req: Request, res: Response) => {
    const {
      items,
      successUrl,
      cancelUrl,
      customerEmail: rawEmail,
      customerName: rawName,
      shippingAddress,
    } = req.body as {
      items: any[];
      successUrl: string;
      cancelUrl: string;
      customerEmail?: string;
      customerName?: string;
      shippingAddress?: any;
    };

    const customerEmail = rawEmail?.trim() || "guest@ohanna.store";
    const customerName = rawName?.trim() || "Guest";

    if (!items?.length) {
      res.status(400).json({ error: "Cart is empty" });
      return;
    }

    const stripeKey = process.env["STRIPE_SECRET_KEY"];
    let sessionId: string;
    let checkoutUrl: string;

    if (stripeKey && stripeKey.startsWith("sk_")) {
      try {
        const Stripe = (await import("stripe")).default;
        const stripe = new Stripe(stripeKey, { apiVersion: "2024-04-10" } as any);

        const lineItems = items.map((item: any) => ({
          price_data: {
            currency: "egp",
            product_data: {
              name: item.product.name,
              description: item.product.description?.slice(0, 200),
            },
            unit_amount: item.product.price,
          },
          quantity: item.quantity,
        }));

        const session = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          line_items: lineItems,
          mode: "payment",
          success_url: successUrl,
          cancel_url: cancelUrl,
          metadata: { source: "ohanna" },
        });

        sessionId = session.id;
        checkoutUrl = session.url || "";
      } catch (stripeErr: unknown) {
        logger.error({ err: stripeErr }, "Stripe error");
        // Fall back to mock order
        sessionId = `mock_${randomUUID()}`;
        checkoutUrl = successUrl.replace("{CHECKOUT_SESSION_ID}", sessionId);
      }
    } else {
      // Mock checkout
      sessionId = `mock_${randomUUID()}`;
      checkoutUrl = successUrl.replace("{CHECKOUT_SESSION_ID}", sessionId);
    }

    // Create order in database or in-memory
    const orderId = `OHN-${Date.now()}`;
    const total = items.reduce((s: number, i: any) => s + i.product.price * i.quantity, 0);

    // Add order details to the checkout URL
    const urlWithDetails = checkoutUrl.includes('?') 
      ? `${checkoutUrl}&order_id=${orderId}&total=${total}`
      : `${checkoutUrl}?order_id=${orderId}&total=${total}`;

    try {
      await orderQueries.create({
        stripeSessionId: sessionId,
        customerEmail: customerEmail.trim(),
        customerName: customerName.trim(),
        shippingAddress,
        items,
        total,
        status: "pending",
      });
    } catch (err) {
      logger.warn("Database unavailable, storing order in memory");
      inMemoryOrders.push({
        id: orderId,
        stripeSessionId: sessionId,
        customerEmail: customerEmail.trim(),
        customerName: customerName.trim(),
        shippingAddress,
        items,
        total,
        status: "pending",
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    res.json({ url: urlWithDetails, sessionId, orderId });
  })
);

/**
 * Track order endpoint
 */
router.get(
  "/track-order",
  asyncHandler(async (req: Request, res: Response) => {
    const orderId = ensureString(req.query.id);
    const email = ensureString(req.query.email);

    if (!orderId || !email) {
      res.status(400).json({ error: "Order ID and email are required" });
      return;
    }

    try {
      // Try to find order in database
      const orders = await orderQueries.getAll();
      const order = orders.find(
        (o: any) => 
          (o.id === orderId || o.stripeSessionId === orderId) && 
          o.customerEmail.toLowerCase() === email.toLowerCase().trim()
      );

      if (order) {
        res.json({ 
          order: {
            id: order.id || orderId,
            status: order.status || "pending",
            total: order.total,
            customerEmail: order.customerEmail,
            customerName: order.customerName,
            items: order.items,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
          }
        });
        return;
      }
    } catch (err) {
      logger.warn("Database unavailable, checking in-memory orders");
    }

    // Check in-memory orders as fallback
    const memOrder = inMemoryOrders.find(
      (o: any) => 
        (o.id === orderId || o.stripeSessionId === orderId) && 
        o.customerEmail.toLowerCase() === email.toLowerCase().trim()
    );

    if (memOrder) {
      res.json({ 
        order: {
          id: memOrder.id || orderId,
          status: memOrder.status || "pending",
          total: memOrder.total,
          customerEmail: memOrder.customerEmail,
          customerName: memOrder.customerName,
          items: memOrder.items,
          createdAt: memOrder.createdAt,
          updatedAt: memOrder.updatedAt,
        }
      });
      return;
    }

    // Order not found
    res.status(404).json({ error: "Order not found" });
  })
);

/**
 * Contact endpoint
 */
router.post(
  "/contact",
  asyncHandler(async (req: Request, res: Response) => {
    const { name, email, subject, message } = req.body as {
      name: string;
      email: string;
      subject?: string;
      message: string;
    };

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      res.status(400).json({ error: "Name, email, and message are required." });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({ error: "Invalid email address." });
      return;
    }

    const contactData = {
      id: randomUUID(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: (subject ?? "").trim(),
      message: message.trim(),
    };

    try {
      await contactQueries.create(contactData);
    } catch (err) {
      logger.warn("Database unavailable, storing contact in memory");
      inMemoryContacts.push({
        ...contactData,
        createdAt: new Date(),
      });
    }

    res.json({ success: true, message: "Message received. We'll reply within 24 hours." });
  })
);

/**
 * Order tracking endpoint
 */
router.get(
  "/track-order",
  asyncHandler(async (req: Request, res: Response) => {
    const id = ensureString(req.query["id"] as string | string[]);
    const email = ensureString(req.query["email"] as string | string[]);

    if (!id || !email) {
      res.status(400).json({ error: "Order ID and email are required." });
      return;
    }

    try {
      const order = await orderQueries.getById(id);

      if (!order || order.customerEmail !== email.toLowerCase()) {
        res.status(404).json({ error: "Order not found." });
        return;
      }

      res.json({ order });
    } catch (err) {
      logger.warn("Database unavailable, checking in-memory orders");
      const order = inMemoryOrders.find(
        (o) => o.id === id && o.customerEmail === email.toLowerCase()
      );

      if (!order) {
        res.status(404).json({ error: "Order not found." });
        return;
      }

      res.json({ order });
    }
  })
);

/**
 * Setup endpoint
 */
router.get(
  "/setup",
  asyncHandler(async (_req: Request, res: Response) => {
    res.json({ status: "ok", message: "OHANNA API ready" });
  })
);

export default router;
