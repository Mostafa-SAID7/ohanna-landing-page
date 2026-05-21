import { Router } from "express";
import { asyncHandler, CacheStrategies } from "../middlewares";
import { orderController } from "../controllers";

const router = Router();

/**
 * POST /checkout - Create checkout session
 * No caching for checkout (dynamic, user-specific)
 */
router.post("/checkout", CacheStrategies.noCache(), asyncHandler(orderController.checkout));

/**
 * GET /track-order - Track order by ID and email
 * Short cache (2 minutes) - order status may change
 */
router.get("/track-order", CacheStrategies.short(), asyncHandler(orderController.trackOrder));

export default router;
