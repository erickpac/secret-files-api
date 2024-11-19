import { Router } from "express";
import * as Controller from "./controller.js";

const router = Router();

router.get("/data", Controller.fetchFiles);

export default router;
