/**
 * In-memory fallback store used when the database is unavailable.
 * Shared across all services so data is consistent within a process lifetime.
 */

import type { ShippingAddress, CartItem, OrderStatus } from "../types";

export interface InMemoryOrder {
  id: string;
  stripeSessionId: string | null;
  customerEmail: string;
  customerName: string;
  shippingAddress: ShippingAddress;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface InMemoryContact {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  createdAt: Date;
}

export const inMemoryOrders: InMemoryOrder[] = [];
export const inMemoryContacts: InMemoryContact[] = [];
