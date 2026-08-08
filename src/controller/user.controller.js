import prisma from "../db/prisma.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";

// Get logged-in user profile
const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      phone: true,
      profileImage: true,
      addresses: true,
      createdAt: true,
    },
  });

  return res.status(200).json(
    new ApiResponse(200, user, "User profile fetched successfully")
  );
});

// List all customers (Admin/Staff dashboard view)
const getAllCustomers = asyncHandler(async (req, res) => {
  const customers = await prisma.user.findMany({
    where: { role: "CUSTOMER" },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      createdAt: true,
      _count: {
        select: { ordersAsCustomer: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return res.status(200).json(
    new ApiResponse(200, customers, "Customers fetched successfully")
  );
});

// Add user address
const addAddress = asyncHandler(async (req, res) => {
  const { label, line1, line2, city, state, postalCode, country, isDefault } = req.body;

  if (!line1 || !city || !state || !postalCode) {
    throw new ApiError(400, "Line 1, city, state and postal code are required");
  }

  const address = await prisma.address.create({
    data: {
      userId: req.user.id,
      label,
      line1,
      line2,
      city,
      state,
      postalCode,
      country: country || "India",
      isDefault: Boolean(isDefault),
    },
  });

  return res.status(201).json(
    new ApiResponse(201, address, "Address added successfully")
  );
});

export { getCurrentUser, getAllCustomers, addAddress };
