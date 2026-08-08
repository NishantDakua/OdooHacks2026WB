import { Router } from "express";

import { createOrder, verifyPayment } from "../controller/payment.controller.js";

const router = Router();

// ── /create-order ────────────────────────────────────────────────────────────
router
  .route("/create-order")
  .post(createOrder)
  .all((req, res) => {
    res.status(405).json({
      success: false,
      message: `Method ${req.method} not allowed on /create-order. Use POST.`,
    });
  });

// ── /verify-payment ──────────────────────────────────────────────────────────
router
  .route("/verify-payment")
  .post(verifyPayment)
  .all((req, res) => {
    res.status(405).json({
      success: false,
      message: `Method ${req.method} not allowed on /verify-payment. Use POST.`,
    });
  });

export default router;
