/**
 * HTTP Cache-Control middleware
 * Sets appropriate cache headers for different endpoints
 */

import { Request, Response, NextFunction } from "express";

/**
 * Cache control options
 */
interface CacheOptions {
  maxAge?: number; // in seconds
  sMaxAge?: number; // for CDN/shared caches
  public?: boolean;
  private?: boolean;
  noCache?: boolean;
  noStore?: boolean;
  mustRevalidate?: boolean;
}

/**
 * Build Cache-Control header value
 */
function buildCacheControl(options: CacheOptions): string {
  const parts: string[] = [];

  if (options.noStore) {
    parts.push("no-store");
    return parts.join(", ");
  }

  if (options.noCache) {
    parts.push("no-cache");
  }

  if (options.public) {
    parts.push("public");
  } else if (options.private) {
    parts.push("private");
  }

  if (options.maxAge !== undefined) {
    parts.push(`max-age=${options.maxAge}`);
  }

  if (options.sMaxAge !== undefined) {
    parts.push(`s-maxage=${options.sMaxAge}`);
  }

  if (options.mustRevalidate) {
    parts.push("must-revalidate");
  }

  return parts.join(", ");
}

/**
 * Create cache control middleware
 */
export function cacheControl(options: CacheOptions) {
  return (_req: Request, res: Response, next: NextFunction) => {
    const cacheHeader = buildCacheControl(options);
    res.setHeader("Cache-Control", cacheHeader);
    next();
  };
}

/**
 * Predefined cache strategies
 */
export const CacheStrategies = {
  /**
   * No caching - for dynamic, user-specific data
   */
  noCache: () => cacheControl({ noStore: true }),

  /**
   * Short cache - for frequently changing data (2 minutes)
   */
  short: () => cacheControl({ public: true, maxAge: 120, sMaxAge: 120 }),

  /**
   * Medium cache - for semi-static data (10 minutes)
   */
  medium: () => cacheControl({ public: true, maxAge: 600, sMaxAge: 600 }),

  /**
   * Long cache - for static data (1 hour)
   */
  long: () => cacheControl({ public: true, maxAge: 3600, sMaxAge: 3600 }),

  /**
   * Very long cache - for immutable data (1 day)
   */
  immutable: () => cacheControl({ public: true, maxAge: 86400, sMaxAge: 86400 }),

  /**
   * Private cache - for user-specific data that can be cached
   */
  private: (maxAge: number = 300) => cacheControl({ private: true, maxAge }),
};
