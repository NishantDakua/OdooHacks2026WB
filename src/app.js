import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import { doubleCsrf } from "csrf-csrf";

// Route imports
import healthCheckRouter from "./routes/healthcheck.route.js";
import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";
import productRouter from "./routes/product.route.js";
import pricelistRouter from "./routes/pricelist.route.js";
import rentalRouter from "./routes/rental.route.js";
import depositRouter from "./routes/deposit.route.js";
import latefeeRouter from "./routes/latefee.route.js";
import inspectionRouter from "./routes/inspection.route.js";
import invoiceRouter from "./routes/invoice.route.js";
import dashboardRouter from "./routes/dashboard.route.js";
import nameRouter from "./routes/name.route.js";
import paymentRouter from "./routes/payment.route.js";

// Middleware imports
import { errorHandler } from "./middleware/error.middleware.js";
import { cacheMiddleware } from "./middleware/cache.middleware.js";

const app = express();

// Security & Parsing Middleware
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: false,
  })
);

app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(",") || "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-csrf-token"],
  })
);

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  message: { error: "Too many requests from this IP, please try again later." },
  standardHeaders: "draft-7",
  legacyHeaders: false,
});
app.use(globalLimiter);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser(process.env.COOKIE_SECRET || "rentease-secret-key"));
app.use(express.static("public"));

// CSRF Protection
const { doubleCsrfProtection, generateToken } = doubleCsrf({
  getSecret: () => process.env.CSRF_SECRET || "rentease-csrf-secret-key",
  cookieName: "rentease.x-csrf-token",
  cookieOptions: {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  },
  size: 64,
  ignoredMethods: ["GET", "HEAD", "OPTIONS"],
  getTokenFromRequest: (req) => req.headers["x-csrf-token"],
});

app.get("/api/v1/csrf-token", (req, res) => {
  const csrfToken = generateToken(req, res);
  res.json({ csrfToken });
});

// Root check
app.get("/", (req, res) => {
  res.send("RentEase Rental Management System API is live");
});

// Mount API routes
app.use("/api/v1/healthcheck", healthCheckRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", cacheMiddleware(300, 600), productRouter);
app.use("/api/v1/pricelists", cacheMiddleware(300, 600), pricelistRouter);
app.use("/api/v1/rentals", rentalRouter);
app.use("/api/v1/deposits", depositRouter);
app.use("/api/v1/late-fees", latefeeRouter);
app.use("/api/v1/inspections", inspectionRouter);
app.use("/api/v1/invoices", invoiceRouter);
app.use("/api/v1/dashboard", dashboardRouter);
app.use("/api/v1/name", nameRouter);
app.use("/api/v1/payments", paymentRouter);

// Global error handler middleware
app.use(errorHandler);

export default app;