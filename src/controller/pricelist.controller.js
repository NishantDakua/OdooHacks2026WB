import prisma from "../db/prisma.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";

// List all pricelists
const getPricelists = asyncHandler(async (req, res) => {
  const pricelists = await prisma.pricelist.findMany({
    include: {
      rules: {
        include: {
          product: { select: { id: true, name: true } },
          variant: { select: { id: true, sku: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return res.status(200).json(
    new ApiResponse(200, pricelists, "Pricelists fetched successfully")
  );
});

// Create pricelist
const createPricelist = asyncHandler(async (req, res) => {
  const { name, isDefault, startDate, endDate } = req.body;

  if (!name) {
    throw new ApiError(400, "Pricelist name is required");
  }

  // If marked default, un-default other pricelists
  if (isDefault) {
    await prisma.pricelist.updateMany({
      where: { isDefault: true },
      data: { isDefault: false },
    });
  }

  const pricelist = await prisma.pricelist.create({
    data: {
      name,
      isDefault: Boolean(isDefault),
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null,
    },
  });

  return res.status(201).json(
    new ApiResponse(201, pricelist, "Pricelist created successfully")
  );
});

// Add rule to pricelist
const addPricelistRule = asyncHandler(async (req, res) => {
  const { pricelistId, productId, variantId, durationValue, durationUnit, price } = req.body;

  if (!pricelistId || !durationValue || !durationUnit || price === undefined) {
    throw new ApiError(400, "Pricelist ID, duration value, duration unit and price are required");
  }

  const rule = await prisma.pricelistRule.create({
    data: {
      pricelistId,
      productId: productId || null,
      variantId: variantId || null,
      durationValue: Number(durationValue),
      durationUnit,
      price: Number(price),
    },
    include: {
      pricelist: true,
      product: true,
      variant: true,
    },
  });

  return res.status(201).json(
    new ApiResponse(201, rule, "Pricelist rule added successfully")
  );
});

export { getPricelists, createPricelist, addPricelistRule };
