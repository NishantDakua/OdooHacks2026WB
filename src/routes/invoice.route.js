import { Router } from "express";
import { createInvoice, recordPayment, getOrderInvoices } from "../controller/invoice.controller.js";
import { verifyJWT, verifyRole } from "../middleware/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.route("/").post(verifyRole(["ADMIN", "STAFF"]), createInvoice);
router.route("/payment").post(recordPayment);
router.route("/order/:orderId").get(getOrderInvoices);

export default router;
