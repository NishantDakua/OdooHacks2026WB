import { Router } from "express";
import { createInspection, addPickupChecklist, togglePickupChecklistItem } from "../controller/inspection.controller.js";
import { verifyJWT, verifyRole } from "../middleware/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.route("/").post(verifyRole(["ADMIN", "STAFF"]), createInspection);
router.route("/checklist").post(verifyRole(["ADMIN", "STAFF"]), addPickupChecklist);
router.route("/checklist/:itemId/toggle").patch(verifyRole(["ADMIN", "STAFF"]), togglePickupChecklistItem);

export default router;
