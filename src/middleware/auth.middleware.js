import jwt from "jsonwebtoken";
import prisma from "../db/prisma.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";

const JWT_SECRET = process.env.JWT_SECRET || "rentease-secret-key-123";

const verifyJWT = asyncHandler(async (req, res, next) => {
  const token =
    req.headers.authorization?.replace("Bearer ", "") ||
    req.cookies?.accessToken;

  if (!token || token === "undefined" || token === "null" || token.trim() === "") {
    throw new ApiError(401, "Unauthorized request — missing access token");
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded || !decoded.id || typeof decoded.id !== "string") {
      throw new ApiError(401, "Invalid access token payload — missing valid user ID");
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
      },
    });

    if (!user) {
      throw new ApiError(401, "Invalid access token — user not found");
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token");
  }
});

const verifyRole = (roles = []) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      throw new ApiError(403, "Forbidden — insufficient permissions");
    }
    next();
  };
};

export { verifyJWT, verifyRole };
