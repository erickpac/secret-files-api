import { FilesRouter, ServerStatusRouter } from "../components/index.js";
import { Router } from "express";

const routes = [
  ["files", FilesRouter],
  ["status", ServerStatusRouter],
];

/**
 * Sets up the routes for the application.
 *
 * @param {Object} app - The Express application instance.
 */
function setRoutes(app) {
  const router = Router();

  app.use("/api/v1/", router);

  routes.forEach(([path, handler]) => {
    router.use(`/${path}`, handler);
  });
}

export default setRoutes;
