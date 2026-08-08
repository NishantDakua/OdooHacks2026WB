import crypto from "crypto";
import prisma from "../db/prisma.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";

// Generate invoice
const createInvoice = asyncHandler(async (req, res) => {
  const { orderId, type, amount, taxAmount = 0 } = req.body;

  if (!orderId || !type || amount === undefined) {
    throw new ApiError(400, "Order ID, invoice type and amount are required");
  }

  const invoiceCount = await prisma.invoice.count();
  const invoiceNumber = `INV_${type}_${(invoiceCount + 1).toString().padStart(5, "0")}`;

  const invoice = await prisma.invoice.create({
    data: {
      orderId,
      invoiceNumber,
      type,
      status: "ISSUED",
      amount: Number(amount),
      taxAmount: Number(taxAmount),
      issuedAt: new Date(),
    },
  });

  return res.status(201).json(
    new ApiResponse(201, invoice, "Invoice generated successfully")
  );
});

// Record payment for invoice or order
const recordPayment = asyncHandler(async (req, res) => {
  const { orderId, invoiceId, method, amount, transactionRef } = req.body;

  if (!orderId || !method || amount === undefined) {
    throw new ApiError(400, "Order ID, payment method and amount are required");
  }

  const payment = await prisma.payment.create({
    data: {
      orderId,
      invoiceId: invoiceId || null,
      method,
      status: "SUCCESS",
      amount: Number(amount),
      transactionRef: transactionRef || `TXN_${crypto.randomBytes(4).toString("hex").toUpperCase()}`,
      paidAt: new Date(),
    },
  });

  // If tied to an invoice, mark invoice PAID
  if (invoiceId) {
    await prisma.invoice.update({
      where: { id: invoiceId },
      data: { status: "PAID" },
    });
  }

  return res.status(201).json(
    new ApiResponse(201, payment, "Payment recorded successfully")
  );
});

// Get order invoices
const getOrderInvoices = asyncHandler(async (req, res) => {
  const { orderId } = req.params;

  const invoices = await prisma.invoice.findMany({
    where: { orderId },
    include: { payments: true },
    orderBy: { createdAt: "desc" },
  });

  return res.status(200).json(
    new ApiResponse(200, invoices, "Order invoices fetched successfully")
  );
});

export { createInvoice, recordPayment, getOrderInvoices };
