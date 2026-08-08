import { Router } from "express";
import {
  getCategories,
  createCategory,
  getProducts,
  getProductById,
  uploadProductImage,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductAvailability,
} from "../controller/product.controller.js";
import { verifyJWT, verifyRole } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";

const router = Router();

// Category routes
router.route("/categories").get(getCategories).post(verifyJWT, verifyRole(["ADMIN", "STAFF"]), createCategory);

// Image upload route (Cloudinary)
router.route("/upload-image").post(verifyJWT, upload.single("image"), uploadProductImage);

// Product routes
router.route("/").get(getProducts).post(verifyJWT, verifyRole(["ADMIN", "STAFF"]), createProduct);
router.route("/:id/availability").get(getProductAvailability);
router.route("/:id")
  .get(getProductById)
  .patch(verifyJWT, verifyRole(["ADMIN", "STAFF"]), updateProduct)
  .delete(verifyJWT, verifyRole(["ADMIN"]), deleteProduct);

export default router;
