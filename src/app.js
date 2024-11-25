import express from "express";
import setRoutes from "./routes/index.js";
import { errorHandler, notFoundHandler } from "./middlewares.js";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

setRoutes(app);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
