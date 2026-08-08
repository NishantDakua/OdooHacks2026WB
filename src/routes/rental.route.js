import { Router } from "express";
import {
  createRentalOrder,
  getRentalOrders,
  getRentalOrderById,
  updateOrderStatus,
} from "../controller/rental.controller.js";
import { verifyJWT, verifyRole } from "../middleware/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.route("/").get(getRentalOrders).post(createRentalOrder);
router.route("/:id").get(getRentalOrderById);
router.route("/:id/status").patch(verifyRole(["ADMIN", "STAFF"]), updateOrderStatus);

export default router;
