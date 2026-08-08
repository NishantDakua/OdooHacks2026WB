import prisma from "../db/prisma.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";

// List all deposits
const getDeposits = asyncHandler(async (req, res) => {
  const { status } = req.query;

  const deposits = await prisma.deposit.findMany({
    where: status ? { status } : {},
    include: {
      order: {
        include: {
          customer: { select: { id: true, name: true, email: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return res.status(200).json(
    new ApiResponse(200, deposits, "Deposits fetched successfully")
  );
});

// Settle deposit deductions (Late fee + damage deductions -> compute refund/shortfall)
const settleDeposit = asyncHandler(async (req, res) => {
  const { depositId } = req.params;
  const { lateFeeDeducted = 0, damageDeducted = 0, otherDeductions = 0, notes } = req.body;

  const deposit = await prisma.deposit.findUnique({
    where: { id: depositId },
    include: { order: true },
  });

  if (!deposit) {
    throw new ApiError(404, "Deposit record not found");
  }

  const collected = Number(deposit.amountCollected);
  const lateFee = Number(lateFeeDeducted);
  const damage = Number(damageDeducted);
  const other = Number(otherDeductions);

  const totalDeduction = lateFee + damage + other;
  const refundAmount = Math.max(0, collected - totalDeduction);
  const shortfallAmount = Math.max(0, totalDeduction - collected);

  const updatedDeposit = await prisma.deposit.update({
    where: { id: depositId },
    data: {
      lateFeeDeducted: lateFee,
      damageDeducted: damage,
      otherDeductions: other,
      totalDeduction,
      refundAmount,
      shortfallAmount,
      status: "SETTLED",
      notes: notes || deposit.notes,
    },
    include: { order: true },
  });

  return res.status(200).json(
    new ApiResponse(200, updatedDeposit, "Deposit settled successfully")
  );
});

// Process Refund payout
const refundDeposit = asyncHandler(async (req, res) => {
  const { depositId } = req.params;

  const deposit = await prisma.deposit.findUnique({ where: { id: depositId } });
  if (!deposit) {
    throw new ApiError(404, "Deposit record not found");
  }

  const updatedDeposit = await prisma.deposit.update({
    where: { id: depositId },
    data: {
      status: "REFUNDED",
      refundedAt: new Date(),
    },
  });

  // Also close the order if settled
  await prisma.rentalOrder.update({
    where: { id: deposit.orderId },
    data: { status: "CLOSED" },
  });

  return res.status(200).json(
    new ApiResponse(200, updatedDeposit, "Deposit refunded and order closed successfully")
  );
});

export { getDeposits, settleDeposit, refundDeposit };
