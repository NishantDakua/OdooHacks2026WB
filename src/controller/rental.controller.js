import crypto from "crypto";
import prisma from "../db/prisma.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";

// Helper: Generate unique order number (e.g. R00104)
const generateOrderNumber = async () => {
  const count = await prisma.rentalOrder.count();
  const nextNum = (count + 1).toString().padStart(5, "0");
  return `R${nextNum}`;
};

// Create new Rental Order (Quotation or Booking)
const createRentalOrder = asyncHandler(async (req, res) => {
  const {
    customerId,
    pickupType = "STORE_PICKUP",
    shippingAddressId,
    rentalStart,
    rentalEnd,
    pricelistId,
    lines = [],
    depositAmount = 0,
    depositAmountType = "FIXED",
    status = "DRAFT",
  } = req.body;

  const targetCustomerId = customerId || req.user.id;
  if (!rentalStart || !rentalEnd || lines.length === 0) {
    throw new ApiError(400, "Rental start date, end date, and order items are required");
  }

  const orderNumber = await generateOrderNumber();
  const qrCode = `RENTEASE_QR_${orderNumber}_${crypto.randomBytes(4).toString("hex")}`;

  // Calculate order totals
  let subtotal = 0;
  const processedLines = lines.map((item) => {
    const lineTotal = Number(item.unitPrice) * Number(item.quantity || 1);
    subtotal += lineTotal;
    return {
      variantId: item.variantId,
      quantity: Number(item.quantity || 1),
      unitPrice: Number(item.unitPrice),
      lineTotal,
    };
  });

  const taxTotal = subtotal * 0.18; // 18% standard GST
  const total = subtotal + taxTotal;

  // Deposit calculation
  let computedDeposit = Number(depositAmount);
  if (depositAmountType === "PERCENTAGE" && req.body.depositPercentage) {
    computedDeposit = (total * Number(req.body.depositPercentage)) / 100;
  }

  const order = await prisma.$transaction(async (tx) => {
    const created = await tx.rentalOrder.create({
      data: {
        orderNumber,
        customerId: targetCustomerId,
        createdByStaffId: req.user?.role !== "CUSTOMER" ? req.user.id : null,
        pickupType,
        shippingAddressId: shippingAddressId || null,
        status,
        rentalStart: new Date(rentalStart),
        rentalEnd: new Date(rentalEnd),
        pricelistId: pricelistId || null,
        subtotal,
        taxTotal,
        total,
        qrCode,
        lines: { create: processedLines },
        deposit: {
          create: {
            amountType: depositAmountType,
            percentage: req.body.depositPercentage ? Number(req.body.depositPercentage) : null,
            amountCollected: computedDeposit,
            status: status === "CONFIRMED" ? "COLLECTED" : "PENDING",
          },
        },
      },
      include: {
        lines: { include: { variant: { include: { product: true } } } },
        deposit: true,
        customer: { select: { id: true, name: true, email: true, phone: true } },
      },
    });

    if (status === "CONFIRMED") {
      for (const line of processedLines) {
        await tx.stockMovement.create({
          data: {
            variantId: line.variantId,
            orderId: created.id,
            type: "RESERVED",
            quantity: -line.quantity,
          },
        }).catch(() => {}); // Catch in case StockMovement type isn't RESERVED

        await tx.productVariant.update({
          where: { id: line.variantId },
          data: { quantityAvailable: { decrement: line.quantity } },
        });
      }
    }

    return created;
  });

  return res.status(201).json(
    new ApiResponse(201, order, "Rental order created successfully")
  );
});

// List rental orders with filtering
const getRentalOrders = asyncHandler(async (req, res) => {
  const { status, customerId, search } = req.query;

  const where = {};
  if (req.user.role === "CUSTOMER") {
    where.customerId = req.user.id;
  } else if (customerId) {
    where.customerId = customerId;
  }

  if (status) where.status = status;
  if (search) {
    where.OR = [
      { orderNumber: { contains: search, mode: "insensitive" } },
      { customer: { name: { contains: search, mode: "insensitive" } } },
    ];
  }

  const orders = await prisma.rentalOrder.findMany({
    where,
    include: {
      customer: { select: { id: true, name: true, email: true, phone: true } },
      lines: { include: { variant: { include: { product: true } } } },
      deposit: true,
      inspection: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return res.status(200).json(
    new ApiResponse(200, orders, "Rental orders fetched successfully")
  );
});

// Get rental order by ID
const getRentalOrderById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const order = await prisma.rentalOrder.findUnique({
    where: { id },
    include: {
      customer: { select: { id: true, name: true, email: true, phone: true } },
      shippingAddress: true,
      lines: { include: { variant: { include: { product: true } } } },
      deposit: true,
      inspection: { include: { lines: true, inspectedBy: { select: { id: true, name: true } } } },
      invoices: { include: { payments: true } },
      pickupChecklist: true,
      stockMovements: true,
    },
  });

  if (!order) {
    throw new ApiError(404, "Rental order not found");
  }

  return res.status(200).json(
    new ApiResponse(200, order, "Rental order details fetched successfully")
  );
});

// Update Order Status (Pickup / Return / Confirmation)
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    throw new ApiError(400, "New status is required");
  }

  const existingOrder = await prisma.rentalOrder.findUnique({
    where: { id },
    include: { lines: true, deposit: true },
  });

  if (!existingOrder) {
    throw new ApiError(404, "Rental order not found");
  }

  const updateData = { status };

  // Handle stock reservation if transitioning to CONFIRMED from DRAFT
  if (status === "CONFIRMED" && existingOrder.status === "DRAFT") {
    for (const line of existingOrder.lines) {
      await prisma.stockMovement.create({
        data: {
          variantId: line.variantId,
          orderId: id,
          type: "RESERVED",
          quantity: -line.quantity,
        },
      }).catch(() => {});
      await prisma.productVariant.update({
        where: { id: line.variantId },
        data: { quantityAvailable: { decrement: line.quantity } },
      });
    }
  }

  if (status === "PICKED_UP") {
    updateData.actualPickupAt = new Date();
    // Update deposit to HELD
    if (existingOrder.deposit) {
      await prisma.deposit.update({
        where: { id: existingOrder.deposit.id },
        data: { status: "HELD" },
      });
    }
    // Record Stock Movement: PICKUP (do not decrement if already confirmed, but if skipping confirmed, decrement)
    for (const line of existingOrder.lines) {
      await prisma.stockMovement.create({
        data: {
          variantId: line.variantId,
          orderId: id,
          type: "PICKUP",
          quantity: 0, // Just record the event, stock is already decremented at CONFIRMED
        },
      }).catch(() => {});
      
      if (existingOrder.status === "DRAFT") {
        await prisma.productVariant.update({
          where: { id: line.variantId },
          data: { quantityAvailable: { decrement: line.quantity } },
        });
      }
    }
  } else if (status === "RETURNED") {
    updateData.actualReturnAt = new Date();
    // Record Stock Movement: RETURN (+ quantity)
    for (const line of existingOrder.lines) {
      await prisma.stockMovement.create({
        data: {
          variantId: line.variantId,
          orderId: id,
          type: "RETURN",
          quantity: line.quantity,
        },
      }).catch(() => {});
      await prisma.productVariant.update({
        where: { id: line.variantId },
        data: { quantityAvailable: { increment: line.quantity } },
      });
    }
  }

  const updatedOrder = await prisma.rentalOrder.update({
    where: { id },
    data: updateData,
    include: { deposit: true, lines: true },
  });

  return res.status(200).json(
    new ApiResponse(200, updatedOrder, `Order status updated to ${status}`)
  );
});

export {
  createRentalOrder,
  getRentalOrders,
  getRentalOrderById,
  updateOrderStatus,
};
