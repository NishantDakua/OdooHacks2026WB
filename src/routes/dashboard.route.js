import { Router } from "express";
import { getDashboardMetrics, getNotifications, markNotificationRead } from "../controller/dashboard.controller.js";
import { verifyJWT, verifyRole } from "../middleware/auth.middleware.js";

const router = Router();

// Apply authentication to all dashboard routes
router.use(verifyJWT);

// Both ADMIN (Vendor) and STAFF can view dashboard metrics
router.route("/metrics").get(verifyRole(["ADMIN", "STAFF"]), getDashboardMetrics);
router.route("/notifications").get(verifyRole(["ADMIN"]), getNotifications);
router.route("/notifications/:id/read").patch(verifyRole(["ADMIN"]), markNotificationRead);

export default router;
