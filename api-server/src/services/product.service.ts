import { productQueries } from "../db/queries";
import { toProductResponse, toProductListResponse } from "../mappers";
import { cache, CacheKeys, CacheTTL } from "../lib/cache";
import { normalizeText } from "../lib/string-utils";
import type { ProductResponse } from "../types";
import { logger } from "../lib/logger";

export const productService = {
  async getAll(): Promise<ProductResponse[]> {
    try {
      return await cache.getOrSet(
        CacheKeys.products.all(),
        async () => {
          const products = await productQueries.getAll();
          return toProductListResponse(products);
        },
        CacheTTL.products
      );
    } catch {
      logger.warn("Database unavailable, returning empty products");
      return [];
    }
  },

  async getById(id: string): Promise<ProductResponse | null> {
    try {
      const normalizedId = normalizeText(id);
      return await cache.getOrSet(
        CacheKeys.products.byId(normalizedId),
        async () => {
          let product = await productQueries.getById(normalizedId);
          if (!product) product = await productQueries.getBySlug(normalizedId);
          return product ? toProductResponse(product) : null;
        },
        CacheTTL.products
      );
    } catch {
      logger.warn("Database unavailable for product lookup");
      return null;
    }
  },

  async getByCategory(category: string): Promise<ProductResponse[]> {
    try {
      const normalizedCategory = normalizeText(category);
      return await cache.getOrSet(
        CacheKeys.products.byCategory(normalizedCategory),
        async () => {
          const products = await productQueries.getByCategory(normalizedCategory);
          return toProductListResponse(products);
        },
        CacheTTL.products
      );
    } catch {
      logger.warn("Database unavailable, returning empty products");
      return [];
    }
  },

  async search(query: string): Promise<ProductResponse[]> {
    try {
      const normalizedQuery = normalizeText(query);
      return await cache.getOrSet(
        CacheKeys.products.search(normalizedQuery),
        async () => {
          const products = await productQueries.search(normalizedQuery);
          return toProductListResponse(products);
        },
        CacheTTL.search
      );
    } catch {
      logger.warn("Database unavailable for search");
      return [];
    }
  },

  /**
   * Invalidate product cache (call after product updates)
   */
  invalidateCache(productId?: string): void {
    if (productId) {
      cache.delete(CacheKeys.products.byId(productId));
    }
    // Invalidate all product-related caches
    cache.invalidatePattern("products:");
  },
};
