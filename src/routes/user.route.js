import { Router } from "express";
import { getCurrentUser, getAllCustomers, addAddress } from "../controller/user.controller.js";
import { verifyJWT, verifyRole } from "../middleware/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.route("/me").get(getCurrentUser);
router.route("/address").post(addAddress);
router.route("/customers").get(verifyRole(["ADMIN", "STAFF"]), getAllCustomers);

export default router;
