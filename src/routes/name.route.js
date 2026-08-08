import { Router } from "express";
import { Name } from "../controller/name.controller.js"

const router = Router();

router.route("/").get(Name);


export default router;