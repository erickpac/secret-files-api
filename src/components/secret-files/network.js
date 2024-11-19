import { Router } from "express";
import * as Controller from "./controller.js";

const router = Router();

router.get("/data", Controller.processFiles);
router.get("/list", Controller.fetchFileList);

export default router;
