/**
 * Centralized ID generation utilities
 * Eliminates duplicate UUID imports across the codebase
 */

import { randomUUID } from "crypto";

/**
 * Generate a standard UUID v4
 */
export function generateId(): string {
  return randomUUID();
}

/**
 * Generate order ID with OHANNA prefix
 */
export function generateOrderId(): string {
  return `OHN-${Date.now()}`;
}

/**
 * Generate product slug from name
 */
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Generate cache-friendly ID
 */
export function generateCacheKey(...parts: string[]): string {
  return parts
    .filter(Boolean)
    .map(part => part.toLowerCase().trim())
    .join(':');
}