import prisma from "../db/prisma.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";

// List all categories
const getCategories = asyncHandler(async (req, res) => {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: "asc" },
  });

  return res.status(200).json(
    new ApiResponse(200, categories, "Categories fetched successfully")
  );
});

// Create new category
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

// List products with category, variants, and price rules
const getProducts = asyncHandler(async (req, res) => {
  const { categoryId, search, isRentable } = req.query;

  const where = {};
  if (categoryId) where.categoryId = categoryId;
  if (isRentable !== undefined) where.isRentable = isRentable === "true";
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
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

// Get single product details
const getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;

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

// Create product with variants
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

// Update product
const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, description, categoryId, isRentable, images } = req.body;

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

// Delete product
const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  await prisma.product.delete({ where: { id } });

  return res.status(200).json(
    new ApiResponse(200, null, "Product deleted successfully")
  );
});

export {
  getCategories,
  createCategory,
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
