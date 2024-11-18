import { Router } from "express";
import * as Controller from "./controller.js";

const router = Router();

router.get("/", Controller.getFiles);

export default router;
