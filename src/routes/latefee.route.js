import { Router } from "express";
import { getLateFeeRules, createLateFeeRule, calculateLateFeeForOrder } from "../controller/latefee.controller.js";
import { verifyJWT, verifyRole } from "../middleware/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.route("/rules").get(getLateFeeRules).post(verifyRole(["ADMIN", "STAFF"]), createLateFeeRule);
router.route("/calculate/:orderId").get(calculateLateFeeForOrder);

export default router;
