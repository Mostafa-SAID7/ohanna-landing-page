import { Router } from "express";
import { asyncHandler, CacheStrategies } from "../middlewares";
import { productController } from "../controllers";

const router = Router();

/**
 * GET /products - Get all products
 * Cached for 10 minutes (products change infrequently)
 */
router.get("/", CacheStrategies.medium(), asyncHandler(productController.getAll));

/**
 * GET /products/:id - Get product by ID or slug
 * Cached for 10 minutes
 */
router.get("/:id", CacheStrategies.medium(), asyncHandler(productController.getById));

/**
 * GET /products/category/:category - Get products by category
 * Cached for 10 minutes
 */
router.get("/category/:category", CacheStrategies.medium(), asyncHandler(productController.getByCategory));

/**
 * GET /products/search/:query - Search products
 * Cached for 5 minutes (search results may vary)
 */
router.get("/search/:query", CacheStrategies.short(), asyncHandler(productController.search));

export default router;
