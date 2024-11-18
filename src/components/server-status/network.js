import { Router } from "express";
import * as Controller from "./controller.js";

const router = Router();

router.get("/", Controller.getStatus);

export default router;
