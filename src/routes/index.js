import IndexController from "../controllers/index.js";
import { Router } from "express";

function setRoutes(app) {
  const indexController = new IndexController();
  const router = Router();

  app.use("/api/v1/", router);

  router.get("/info", indexController.getIndex);
}

export default setRoutes;
