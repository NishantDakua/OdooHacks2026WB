import { Router } from "express";
import { signup, vendorSignup, login, resetPassword } from "../controller/auth.controller.js";

const router = Router();

router.route("/signup").post(signup);
router.route("/vendor-signup").post(vendorSignup);
router.route("/login").post(login);
router.route("/reset-password").post(resetPassword);

export default router;
