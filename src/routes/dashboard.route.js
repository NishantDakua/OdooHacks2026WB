import { Router } from "express";
import { getDashboardMetrics } from "../controller/dashboard.controller.js";
import { verifyJWT, verifyRole } from "../middleware/auth.middleware.js";

const router = Router();

router.use(verifyJWT);
router.route("/metrics").get(verifyRole(["ADMIN", "STAFF"]), getDashboardMetrics);

export default router;
