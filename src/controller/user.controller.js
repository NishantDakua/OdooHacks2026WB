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

// Get single user by ID
const getUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      phone: true,
      profileImage: true,
      addresses: true,
      createdAt: true,
      ordersAsCustomer: {
        include: {
          lines: { include: { variant: { include: { product: true } } } },
          deposit: true,
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res.status(200).json(
    new ApiResponse(200, user, "User details fetched successfully")
  );
});

// Update user details (Admin only or self)
const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, email, phone, role, address } = req.body;

  const existingUser = await prisma.user.findUnique({ where: { id } });
  if (!existingUser) {
    throw new ApiError(404, "User not found");
  }

  // If email is changing, check uniqueness
  if (email && email !== existingUser.email) {
    const emailConflict = await prisma.user.findUnique({ where: { email } });
    if (emailConflict) {
      throw new ApiError(409, "A user with this email already exists");
    }
  }

  const updateData = {};
  if (name !== undefined) updateData.name = name;
  if (email !== undefined) updateData.email = email;
  if (phone !== undefined) updateData.phone = phone;
  if (role !== undefined && req.user.role === "ADMIN") {
    updateData.role = role;
  }

  const updatedUser = await prisma.user.update({
    where: { id },
    data: updateData,
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

  if (address && (address.line1 || address.city)) {
    await prisma.address.create({
      data: {
        userId: id,
        label: address.label || "Home",
        line1: address.line1 || "",
        line2: address.line2 || "",
        city: address.city || "",
        state: address.state || "",
        postalCode: address.postalCode || "",
        country: address.country || "India",
      },
    }).catch(() => {});
  }

  return res.status(200).json(
    new ApiResponse(200, updatedUser, "User updated successfully in database")
  );
});

export { getCurrentUser, getAllCustomers, addAddress, getUserById, updateUser };
