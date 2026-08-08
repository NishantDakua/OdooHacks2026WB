import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../db/prisma.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";

const JWT_SECRET = process.env.JWT_SECRET || "rentease-secret-key-123";

const generateToken = (userId, role) => {
  return jwt.sign({ id: userId, role }, JWT_SECRET, { expiresIn: "7d" });
};

const signup = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  if (!email || !password || !firstName) {
    throw new ApiError(400, "First name, email and password are required");
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new ApiError(409, "User with this email already exists");
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const fullName = `${firstName} ${lastName || ""}`.trim();

  const user = await prisma.user.create({
    data: {
      name: fullName,
      email,
      passwordHash,
      role: "CUSTOMER",
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  const token = generateToken(user.id, user.role);

  return res.status(201).json(
    new ApiResponse(201, { user, token }, "Account created successfully")
  );
});

const vendorSignup = asyncHandler(async (req, res) => {
  const { firstName, lastName, companyName, category, gstNumber, email, password } = req.body;

  if (!email || !password || !firstName || !companyName) {
    throw new ApiError(400, "Name, company name, email and password are required");
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new ApiError(409, "Vendor account with this email already exists");
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const fullName = `${firstName} ${lastName || ""}`.trim();

  const user = await prisma.user.create({
    data: {
      name: fullName,
      email,
      passwordHash,
      role: "ADMIN",
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  if (category) {
    await prisma.category.create({
      data: { name: category },
    }).catch(() => {});
  }

  const token = generateToken(user.id, user.role);

  return res.status(201).json(
    new ApiResponse(201, { user, companyName, gstNumber, token }, "Vendor registered successfully")
  );
});

const login = asyncHandler(async (req, res) => {
  const { email, loginId, password } = req.body;
  const userIdentifier = email || loginId;

  if (!userIdentifier || !password) {
    throw new ApiError(400, "Email/Login ID and password are required");
  }

  const user = await prisma.user.findUnique({
    where: { email: userIdentifier },
  });

  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid email or password");
  }

  const token = generateToken(user.id, user.role);

  const userData = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone,
    profileImage: user.profileImage,
  };

  return res.status(200).json(
    new ApiResponse(200, { user: userData, token }, "Logged in successfully")
  );
});

const resetPassword = asyncHandler(async (req, res) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    throw new ApiError(400, "Email and new password are required");
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new ApiError(404, "User with this email not found");
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash },
  });

  return res.status(200).json(
    new ApiResponse(200, null, "Password updated successfully")
  );
});

export { signup, vendorSignup, login, resetPassword };
