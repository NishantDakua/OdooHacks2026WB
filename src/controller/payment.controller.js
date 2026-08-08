import crypto from "crypto";

import { keyId, keySecret, getRazorpayInstance } from "../config/razorpay.js";

const createOrder = async (req, res) => {
  try {
    const amount = Number(req.body.amount);
    const currency = (req.body.currency || "INR").toUpperCase();
    const receipt = (req.body.receipt || `receipt_${Date.now()}`).toString();

    if (!Number.isFinite(amount) || amount < 100) {
      return res.status(400).json({
        success: false,
        message: "Amount must be at least 100 paise.",
      });
    }

    const razorpay = getRazorpayInstance();

    const order = await razorpay.orders.create({
      amount: Math.round(amount),
      currency,
      receipt,
    });

    return res.status(201).json({
      success: true,
      data: {
        order_id: order.id,
        amount: order.amount,
        currency: order.currency,
        key_id: keyId,
      },
    });
  } catch (error) {
    console.error("[payments] createOrder error:", error?.message || error);

    if (error?.statusCode === 401) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized while creating Razorpay order. Check your API keys.",
      });
    }

    const status = error?.statusCode && error.statusCode >= 400 ? error.statusCode : 500;
    return res.status(status).json({
      success: false,
      message: error?.message || "Failed to create Razorpay order.",
    });
  }
};

const verifyPayment = (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Missing payment verification fields.",
      });
    }

    if (!keySecret) {
      return res.status(500).json({
        success: false,
        message: "Server misconfiguration: Razorpay key secret is not set.",
      });
    }

    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Payment verified successfully.",
    });
  } catch (error) {
    console.error("[payments] verifyPayment error:", error?.message || error);
    return res.status(500).json({
      success: false,
      message: error?.message || "Failed to verify payment.",
    });
  }
};

export { createOrder, verifyPayment };
