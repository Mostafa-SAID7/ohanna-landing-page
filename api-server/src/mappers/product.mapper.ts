import type { Product } from "../db/schema";
import type { ProductResponse } from "../types";

/**
 * Map a DB product row to the public API response shape.
 */
export function toProductResponse(product: Product): ProductResponse {
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    category: product.category,
    badge: product.badge ?? undefined,
    imageUrl: product.imageUrl,
    stock: product.stock,
    slug: product.slug ?? undefined,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  };
}

export function toProductListResponse(products: Product[]): ProductResponse[] {
  return products.map(toProductResponse);
}
