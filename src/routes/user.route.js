import { Router } from "express";
import { getCurrentUser, getAllCustomers, addAddress, getUserById, updateUser } from "../controller/user.controller.js";
import { verifyJWT, verifyRole } from "../middleware/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.route("/me").get(getCurrentUser);
router.route("/address").post(addAddress);
router.route("/customers").get(verifyRole(["ADMIN", "STAFF"]), getAllCustomers);
router.route("/:id")
  .get(getUserById)
  .patch(verifyRole(["ADMIN"]), updateUser);

export default router;
