import { Router } from "express";
import productsRouter from "./products";
import ordersRouter from "./orders";
import contactRouter from "./contact";

const router = Router();

/**
 * Mount route modules
 */
router.use("/products", productsRouter);
router.use("/", ordersRouter);
router.use("/contact", contactRouter);

/**
 * Setup endpoint
 */
router.get("/setup", (_req, res) => {
  res.json({ status: "ok", message: "OHANNA API ready" });
});

export default router;
