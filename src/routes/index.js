import { FilesRouter, ServerStatusRouter } from "../components/index.js";
import { Router } from "express";

const routes = [
  ["files", FilesRouter],
  ["status", ServerStatusRouter],
];

function setRoutes(app) {
  const router = Router();

  app.use("/api/v1/", router);

  routes.forEach(([path, handler]) => {
    router.use(`/${path}`, handler);
  });
}

export default setRoutes;
