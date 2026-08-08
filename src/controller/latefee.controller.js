import prisma from "../db/prisma.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";

// Get late fee rules
const getLateFeeRules = asyncHandler(async (req, res) => {
  const rules = await prisma.lateFeeRule.findMany({
    include: {
      product: { select: { id: true, name: true } },
      variant: { select: { id: true, sku: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return res.status(200).json(
    new ApiResponse(200, rules, "Late fee rules fetched successfully")
  );
});

// Create late fee rule
const createLateFeeRule = asyncHandler(async (req, res) => {
  const { name, productId, variantId, chargeBasis = "DAILY", rate, gracePeriodHours = 1, maxFee } = req.body;

  if (!name || rate === undefined) {
    throw new ApiError(400, "Rule name and rate are required");
  }

  const rule = await prisma.lateFeeRule.create({
    data: {
      name,
      productId: productId || null,
      variantId: variantId || null,
      chargeBasis,
      rate: Number(rate),
      gracePeriodHours: Number(gracePeriodHours),
      maxFee: maxFee ? Number(maxFee) : null,
    },
  });

  return res.status(201).json(
    new ApiResponse(201, rule, "Late fee rule created successfully")
  );
});

// Calculate late fee for order dynamically
const calculateLateFeeForOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.params;

  const order = await prisma.rentalOrder.findUnique({
    where: { id: orderId },
    include: { lines: { include: { variant: true } } },
  });

  if (!order) {
    throw new ApiError(404, "Rental order not found");
  }

  const now = order.actualReturnAt ? new Date(order.actualReturnAt) : new Date();
  const rentalEnd = new Date(order.rentalEnd);

  if (now <= rentalEnd) {
    return res.status(200).json(
      new ApiResponse(200, { lateFee: 0, overdueHours: 0 }, "Order is not overdue")
    );
  }

  const diffMs = now - rentalEnd;
  const overdueHours = diffMs / (1000 * 60 * 60);

  // Fetch applicable rule (most specific variant -> product -> default company-wide)
  const rules = await prisma.lateFeeRule.findMany({ where: { active: true } });
  const defaultRule = rules.find((r) => !r.productId && !r.variantId) || {
    chargeBasis: "DAILY",
    rate: 100,
    gracePeriodHours: 1,
    maxFee: 5000,
  };

  if (overdueHours <= (defaultRule.gracePeriodHours || 1)) {
    return res.status(200).json(
      new ApiResponse(200, { lateFee: 0, overdueHours }, "Within grace period")
    );
  }

  let lateFee = 0;
  const effectiveHours = overdueHours - (defaultRule.gracePeriodHours || 1);

  if (defaultRule.chargeBasis === "HOURLY") {
    lateFee = Math.ceil(effectiveHours) * Number(defaultRule.rate);
  } else {
    // DAILY basis
    const overdueDays = Math.ceil(effectiveHours / 24);
    lateFee = overdueDays * Number(defaultRule.rate);
  }

  if (defaultRule.maxFee && lateFee > Number(defaultRule.maxFee)) {
    lateFee = Number(defaultRule.maxFee);
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      { lateFee, overdueHours: Math.round(overdueHours * 10) / 10, ruleUsed: defaultRule.name || "Default Rule" },
      "Late fee calculated successfully"
    )
  );
});

export { getLateFeeRules, createLateFeeRule, calculateLateFeeForOrder };
