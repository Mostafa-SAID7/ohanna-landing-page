import { Router } from "express";
import { asyncHandler, CacheStrategies } from "../middlewares";
import { contactController } from "../controllers";

const router = Router();

/**
 * POST /contact - Submit contact form
 * No caching for contact submissions
 */
router.post("/", CacheStrategies.noCache(), asyncHandler(contactController.submit));

export default router;
