import dotenv from "dotenv";
import express from "express";
import cors from "cors";

dotenv.config({
  path: "./.env",
});

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
import paymentRouter from "./routes/payment.route.js";

// Middleware imports
import { errorHandler } from "./middleware/error.middleware.js";

const app = express();

// CORS configuration
app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(",") || "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Express middleware
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));

// Mount API routes
app.use("/api/v1/healthcheck", healthCheckRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/pricelists", pricelistRouter);
app.use("/api/v1/rentals", rentalRouter);
app.use("/api/v1/deposits", depositRouter);
app.use("/api/v1/late-fees", latefeeRouter);
app.use("/api/v1/inspections", inspectionRouter);
app.use("/api/v1/invoices", invoiceRouter);
app.use("/api/v1/dashboard", dashboardRouter);
app.use("/api/v1/payments", paymentRouter);

app.get("/", (req, res) => {
  res.send("RentEase Rental Management System API is live");
});

// Global error handler middleware
app.use(errorHandler);

export default app;