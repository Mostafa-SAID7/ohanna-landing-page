import { orderQueries } from "../db/queries";
import { toOrderResponse } from "../mappers";
import { inMemoryOrders } from "../lib/in-memory-store";
import { generateOrderId } from "../lib/id-generator";
import { validateEmail, normalizeName } from "../lib/string-utils";
import { cache, CacheKeys, CacheTTL } from "../lib/cache";
import { logger } from "../lib/logger";
import type { CheckoutRequest, CheckoutResponse, OrderDetails } from "../types";

export const orderService = {
  async createCheckout(
    data: CheckoutRequest & { successUrl: string; cancelUrl: string }
  ): Promise<CheckoutResponse> {
    const { items, successUrl, cancelUrl, customerEmail, customerName, shippingAddress } = data;

    // Validate and normalize input data
    const normalizedEmail = validateEmail(customerEmail);
    const normalizedName = normalizeName(customerName);

    const stripeKey = process.env["STRIPE_SECRET_KEY"];
    let sessionId: string;
    let checkoutUrl: string;

    if (stripeKey && stripeKey.startsWith("sk_")) {
      try {
        const Stripe = (await import("stripe")).default;
        const stripe = new Stripe(stripeKey, { 
          apiVersion: "2024-04-10" as const // Type-safe API version
        });

        const lineItems = items.map((item) => ({
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
      } catch (err) {
        logger.error({ err }, "Stripe error — falling back to mock");
        sessionId = `mock_${generateOrderId()}`;
        checkoutUrl = successUrl.replace("{CHECKOUT_SESSION_ID}", sessionId);
      }
    } else {
      sessionId = `mock_${generateOrderId()}`;
      checkoutUrl = successUrl.replace("{CHECKOUT_SESSION_ID}", sessionId);
    }

    const orderId = generateOrderId();
    const total = items.reduce((s, i) => s + i.product.price * i.quantity, 0);

    // Append order details to success URL
    const url = checkoutUrl.includes("?")
      ? `${checkoutUrl}&order_id=${orderId}&total=${total}`
      : `${checkoutUrl}?order_id=${orderId}&total=${total}`;

    try {
      await orderQueries.create({
        stripeSessionId: sessionId,
        customerEmail: normalizedEmail,
        customerName: normalizedName,
        shippingAddress,
        items,
        total,
        status: "pending",
      });
      
      // Invalidate order cache for this email
      cache.invalidatePattern(`orders:email:${normalizedEmail}`);
    } catch {
      logger.warn("Database unavailable, storing order in memory");
      inMemoryOrders.push({
        id: orderId,
        stripeSessionId: sessionId,
        customerEmail: normalizedEmail,
        customerName: normalizedName,
        shippingAddress,
        items,
        total,
        status: "pending",
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    return { url, sessionId, orderId };
  },

  async trackOrder(
    orderId: string,
    email: string
  ): Promise<OrderDetails | null> {
    const normalizedEmail = validateEmail(email);
    const cacheKey = `${CacheKeys.orders.byId(orderId)}:${normalizedEmail}`;

    // Try cache first
    const cached = cache.get<OrderDetails>(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      // Optimized: Try direct lookup by ID first
      let order = await orderQueries.getById(orderId);
      
      // If not found by ID, try by Stripe session ID
      if (!order) {
        order = await orderQueries.getByStripeSessionId(orderId);
      }

      // Verify email matches
      if (order && order.customerEmail.toLowerCase() === normalizedEmail) {
        const result = toOrderResponse(order);
        cache.set(cacheKey, result, CacheTTL.orders);
        return result;
      }
    } catch {
      logger.warn("Database unavailable, checking in-memory orders");
    }

    // Fallback to in-memory orders
    const memOrder = inMemoryOrders.find(
      (o) =>
        (o.id === orderId || o.stripeSessionId === orderId) &&
        o.customerEmail.toLowerCase() === normalizedEmail
    );

    if (memOrder) {
      const result = toOrderResponse(memOrder);
      cache.set(cacheKey, result, CacheTTL.orders);
      return result;
    }

    return null;
  },

  /**
   * Invalidate order cache (call after order updates)
   */
  invalidateCache(orderId?: string, email?: string): void {
    if (orderId) {
      cache.invalidatePattern(`orders:id:${orderId}`);
    }
    if (email) {
      cache.invalidatePattern(`orders:email:${email.toLowerCase()}`);
    }
  },
};
