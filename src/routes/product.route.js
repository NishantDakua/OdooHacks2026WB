import { Router } from "express";
import {
  getCategories,
  createCategory,
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controller/product.controller.js";
import { verifyJWT, verifyRole } from "../middleware/auth.middleware.js";

const router = Router();

// Category routes
router.route("/categories").get(getCategories).post(verifyJWT, verifyRole(["ADMIN", "STAFF"]), createCategory);

// Product routes
router.route("/").get(getProducts).post(verifyJWT, verifyRole(["ADMIN", "STAFF"]), createProduct);
router.route("/:id")
  .get(getProductById)
  .patch(verifyJWT, verifyRole(["ADMIN", "STAFF"]), updateProduct)
  .delete(verifyJWT, verifyRole(["ADMIN"]), deleteProduct);

export default router;
