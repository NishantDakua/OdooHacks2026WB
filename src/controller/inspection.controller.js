import prisma from "../db/prisma.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";

// Record return inspection
const createInspection = asyncHandler(async (req, res) => {
  const { orderId, lines = [] } = req.body;

  if (!orderId || lines.length === 0) {
    throw new ApiError(400, "Order ID and inspection line items are required");
  }

  const existingOrder = await prisma.rentalOrder.findUnique({
    where: { id: orderId },
    include: { deposit: true },
  });

  if (!existingOrder) {
    throw new ApiError(404, "Rental order not found");
  }

  let totalDamageCost = 0;
  const processedLines = lines.map((l) => {
    const deduction = l.isOk ? 0 : Number(l.deductionAmount || 0);
    totalDamageCost += deduction;
    return {
      itemName: l.itemName,
      isOk: Boolean(l.isOk),
      deductionAmount: deduction,
      notes: l.notes || null,
    };
  });

  // Create Inspection record
  const inspection = await prisma.inspection.create({
    data: {
      orderId,
      inspectedById: req.user.id,
      totalDamageCost,
      lines: { create: processedLines },
    },
    include: { lines: true, inspectedBy: { select: { id: true, name: true } } },
  });

  // Automatically update deposit damage deduction if deposit exists
  if (existingOrder.deposit) {
    await prisma.deposit.update({
      where: { id: existingOrder.deposit.id },
      data: { damageDeducted: totalDamageCost },
    });
  }

  // Update order status to RETURNED if not already
  await prisma.rentalOrder.update({
    where: { id: orderId },
    data: { status: "RETURNED", actualReturnAt: new Date() },
  });

  return res.status(201).json(
    new ApiResponse(201, inspection, "Return inspection completed successfully")
  );
});

// Create pickup checklist items for an order
const addPickupChecklist = asyncHandler(async (req, res) => {
  const { orderId, items = [] } = req.body;

  if (!orderId || items.length === 0) {
    throw new ApiError(400, "Order ID and checklist items are required");
  }

  const createdItems = await prisma.pickupChecklistItem.createMany({
    data: items.map((itemName) => ({ orderId, itemName })),
  });

  return res.status(201).json(
    new ApiResponse(201, createdItems, "Pickup checklist items added successfully")
  );
});

// Toggle pickup checklist item
const togglePickupChecklistItem = asyncHandler(async (req, res) => {
  const { itemId } = req.params;

  const item = await prisma.pickupChecklistItem.findUnique({ where: { id: itemId } });
  if (!item) {
    throw new ApiError(404, "Checklist item not found");
  }

  const updatedItem = await prisma.pickupChecklistItem.update({
    where: { id: itemId },
    data: { isChecked: !item.isChecked },
  });

  return res.status(200).json(
    new ApiResponse(200, updatedItem, "Checklist item updated")
  );
});

export { createInspection, addPickupChecklist, togglePickupChecklistItem };
