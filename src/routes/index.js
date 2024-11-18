import { FilesRouter } from "../components/index.js";
import { Router } from "express";

const routes = [["files", FilesRouter]];

function setRoutes(app) {
  const router = Router();

  app.use("/api/v1/", router);

  routes.forEach(([path, handler]) => {
    router.use(`/${path}`, handler);
  });

  // Error handling middleware
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Something broke!" });
  });
}

export default setRoutes;
