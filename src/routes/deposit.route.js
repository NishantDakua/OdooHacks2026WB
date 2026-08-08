import { Router } from "express";
import { getDeposits, settleDeposit, refundDeposit } from "../controller/deposit.controller.js";
import { verifyJWT, verifyRole } from "../middleware/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.route("/").get(verifyRole(["ADMIN", "STAFF"]), getDeposits);
router.route("/:depositId/settle").post(verifyRole(["ADMIN", "STAFF"]), settleDeposit);
router.route("/:depositId/refund").post(verifyRole(["ADMIN", "STAFF"]), refundDeposit);

export default router;
