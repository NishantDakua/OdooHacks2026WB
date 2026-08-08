import { Router } from "express";
import { getPricelists, createPricelist, addPricelistRule } from "../controller/pricelist.controller.js";
import { verifyJWT, verifyRole } from "../middleware/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.route("/").get(getPricelists).post(verifyRole(["ADMIN", "STAFF"]), createPricelist);
router.route("/rules").post(verifyRole(["ADMIN", "STAFF"]), addPricelistRule);

export default router;
