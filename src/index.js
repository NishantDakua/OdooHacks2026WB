import dotenv from "dotenv";

dotenv.config({
  path: "./.env",
});

import app from "./app.js";

const port = process.env.PORT || 5000;

const server = app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// Keep process active & listening continuously
setInterval(() => {}, 1000 * 60 * 60);

process.on("unhandledRejection", (err) => {
  console.error("[Backend Unhandled Rejection]:", err);
});

process.on("uncaughtException", (err) => {
  console.error("[Backend Uncaught Exception]:", err);
});
