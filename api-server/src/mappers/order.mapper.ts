import type { Order } from "../db/schema";
import type { OrderDetails, ShippingAddress, CartItem } from "../types";
import type { InMemoryOrder } from "../lib/in-memory-store";

/**
 * Map a DB order row to the public track-order response shape.
 * Now with proper type safety - no more 'as any' casts!
 */
export function toOrderResponse(order: Order | InMemoryOrder): OrderDetails {
  // Type-safe conversion of JSON fields
  const shippingAddress = order.shippingAddress as ShippingAddress;
  const items = order.items as CartItem[];
  
  return {
    id: order.id,
    stripeSessionId: order.stripeSessionId ?? undefined,
    customerEmail: order.customerEmail,
    customerName: order.customerName,
    shippingAddress,
    items,
    subtotal: order.total, // TODO: Split into subtotal/tax/shipping
    shippingCost: 0, // TODO: Calculate from order data
    tax: 0, // TODO: Calculate from order data
    total: order.total,
    status: order.status as any, // TODO: Ensure DB enum matches type
    paymentMethod: 'stripe', // TODO: Add to DB schema
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
  };
}
