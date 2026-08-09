import jwt from "jsonwebtoken";
import prisma from "../db/prisma.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const getCategories = asyncHandler(async (req, res) => {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: "asc" },
  });

  return res.status(200).json(
    new ApiResponse(200, categories, "Categories fetched successfully")
  );
});

const createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;
  if (!name) {
    throw new ApiError(400, "Category name is required");
  }

  const category = await prisma.category.create({
    data: { name },
  });

  return res.status(201).json(
    new ApiResponse(201, category, "Category created successfully")
  );
});

const getProducts = asyncHandler(async (req, res) => {
  const { categoryId, search, isRentable, vendorId } = req.query;

  const where = {};

  if (categoryId && categoryId !== "undefined" && categoryId !== "null" && typeof categoryId === "string") {
    where.categoryId = categoryId;
  }
  if (vendorId && vendorId !== "undefined" && vendorId !== "null" && typeof vendorId === "string") {
    where.vendorId = vendorId;
  }
  if (isRentable !== undefined && isRentable !== "undefined" && isRentable !== "null" && isRentable !== "") {
    where.isRentable = String(isRentable) === "true";
  }
  if (search && search !== "undefined" && search !== "null" && typeof search === "string" && search.trim() !== "") {
    where.OR = [
      { name: { contains: search.trim(), mode: "insensitive" } },
      { description: { contains: search.trim(), mode: "insensitive" } },
    ];
  }

  const products = await prisma.product.findMany({
    where,
    include: {
      category: true,
      variants: true,
      pricelistRules: true,
      lateFeeRules: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return res.status(200).json(
    new ApiResponse(200, products, "Products fetched successfully")
  );
});

const getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id || id === "undefined" || id === "null" || typeof id !== "string") {
    throw new ApiError(400, "Valid product ID is required");
  }

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      variants: {
        include: {
          stockMovements: { take: 5, orderBy: { createdAt: "desc" } },
        },
      },
      pricelistRules: true,
      lateFeeRules: true,
    },
  });

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  return res.status(200).json(
    new ApiResponse(200, product, "Product details fetched successfully")
  );
});

const uploadProductImage = asyncHandler(async (req, res) => {
  const localFilePath = req.file?.path;
  if (!localFilePath) {
    throw new ApiError(400, "Image file is required");
  }

  const uploadResult = await uploadOnCloudinary(localFilePath);
  if (!uploadResult || !uploadResult.url) {
    throw new ApiError(500, "Failed to upload image");
  }

  return res.status(200).json(
    new ApiResponse(200, { url: uploadResult.url }, "Image uploaded successfully")
  );
});

const createProduct = asyncHandler(async (req, res) => {
  const { name, description, categoryId, images = [], variants = [] } = req.body;

  if (!name) {
    throw new ApiError(400, "Product name is required");
  }

  const product = await prisma.product.create({
    data: {
      name,
      description,
      categoryId: categoryId || null,
      vendorId: req.user.role === "ADMIN" ? req.user.id : null,
      images,
      variants: {
        create: variants.map((v, idx) => ({
          sku: v.sku || `${name.toUpperCase().replace(/\s+/g, "_")}_V${idx + 1}`,
          brand: v.brand || null,
          manufacturer: v.manufacturer || null,
          color: v.color || null,
          size: v.size || null,
          quantityTotal: Number(v.quantityTotal) || 1,
          quantityAvailable: Number(v.quantityAvailable || v.quantityTotal) || 1,
        })),
      },
    },
    include: {
      category: true,
      variants: true,
    },
  });

  return res.status(201).json(
    new ApiResponse(201, product, "Product created successfully")
  );
});

const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, description, categoryId, isRentable, images, variants } = req.body;

  if (Array.isArray(variants) && variants.length > 0) {
    for (const v of variants) {
      if (v.id) {
        await prisma.productVariant.update({
          where: { id: v.id },
          data: {
            ...(v.sku && { sku: v.sku }),
            ...(v.brand !== undefined && { brand: v.brand }),
            ...(v.color !== undefined && { color: v.color }),
            ...(v.size !== undefined && { size: v.size }),
            quantityTotal: Number(v.quantityTotal || 1),
            quantityAvailable: Number(v.quantityAvailable ?? v.quantityTotal ?? 1),
          },
        });
      } else {
        await prisma.productVariant.create({
          data: {
            productId: id,
            sku: v.sku || `${(name || "PRODUCT").toUpperCase().replace(/\s+/g, "_")}_V${Date.now()}`,
            brand: v.brand || null,
            color: v.color || null,
            size: v.size || null,
            quantityTotal: Number(v.quantityTotal || 1),
            quantityAvailable: Number(v.quantityAvailable ?? v.quantityTotal ?? 1),
          },
        });
      }
    }
  }

  const product = await prisma.product.update({
    where: { id },
    data: {
      ...(name && { name }),
      ...(description !== undefined && { description }),
      ...(categoryId !== undefined && { categoryId }),
      ...(isRentable !== undefined && { isRentable: Boolean(isRentable) }),
      ...(images && { images }),
    },
    include: { category: true, variants: true },
  });

  return res.status(200).json(
    new ApiResponse(200, product, "Product updated successfully")
  );
});

const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  await prisma.product.delete({ where: { id } });

  return res.status(200).json(
    new ApiResponse(200, null, "Product deleted successfully")
  );
});

const getProductAvailability = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { startDate, endDate, quantity = 1, variantId } = req.query;

  if (!id || id === "undefined" || id === "null" || typeof id !== "string") {
    throw new ApiError(400, "Valid product ID is required");
  }

  if (!startDate || !endDate) {
    throw new ApiError(400, "startDate and endDate are required");
  }

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (start >= end) {
    throw new ApiError(400, "endDate must be strictly after startDate");
  }

  const product = await prisma.product.findUnique({
    where: { id },
    include: { variants: true }
  });

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  let variant;
  if (variantId) {
    variant = product.variants.find(v => v.id === variantId);
    if (!variant) {
      throw new ApiError(404, `Variant ${variantId} not found for this product`);
    }
  } else {
    variant = product.variants[0];
    if (!variant) {
      throw new ApiError(404, "Product has no variants");
    }
  }

  // Find overlapping rentals
  const overlappingOrders = await prisma.rentalOrderLine.aggregate({
    _sum: { quantity: true },
    where: {
      variantId: variant.id,
      order: {
        status: { in: ["CONFIRMED", "PICKED_UP", "RETURNED"] },
        rentalStart: { lt: end },
        rentalEnd: { gt: start }
      }
    }
  });

  const reservedQty = overlappingOrders._sum.quantity || 0;
  const availableQty = variant.quantityTotal - reservedQty;

  const isAvailable = availableQty >= Number(quantity);

  return res.status(200).json(
    new ApiResponse(200, {
      availableQty,
      requestedQty: Number(quantity),
      isAvailable,
      reservedQty,
      totalQty: variant.quantityTotal
    }, "Availability checked")
  );
});

export {
  getCategories,
  createCategory,
  getProducts,
  getProductById,
  uploadProductImage,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductAvailability,
};
