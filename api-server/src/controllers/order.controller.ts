import type { Request, Response } from "express";
import { orderService } from "../services";
import { ensureString } from "../lib/query-helpers";

export const orderController = {
  async checkout(req: Request, res: Response): Promise<void> {
    const {
      items,
      successUrl,
      cancelUrl,
      customerEmail,
      customerName,
      shippingAddress,
    } = req.body;

    if (!items?.length) {
      res.status(400).json({ error: "Cart is empty" });
      return;
    }

    const result = await orderService.createCheckout({
      items,
      successUrl,
      cancelUrl,
      customerEmail: customerEmail?.trim() || "guest@ohanna.store",
      customerName: customerName?.trim() || "Guest",
      shippingAddress,
    });

    res.json(result);
  },

  async trackOrder(req: Request, res: Response): Promise<void> {
    const orderId = ensureString(req.query.id as string | string[] | undefined);
    const email = ensureString(req.query.email as string | string[] | undefined);

    if (!orderId || !email) {
      res.status(400).json({ error: "Order ID and email are required" });
      return;
    }

    const order = await orderService.trackOrder(orderId, email);
    if (!order) {
      res.status(404).json({ error: "Order not found" });
      return;
    }

    res.json({ order });
  },
};
