/**
 * Centralized type exports
 * Re-exports all types from domain-specific files
 */

// Shared types
export * from './shared.types';

// Domain-specific types
export * from './product.types';
export * from './order.types';
export * from './contact.types';

// API-specific types
export * from './api.types';

// Legacy exports for backward compatibility
// TODO: Remove these after updating all imports
export type { ProductResponse as ProductResponseLegacy } from './product.types';
export type { OrderDetails as TrackOrderResponseOrder } from './order.types';
