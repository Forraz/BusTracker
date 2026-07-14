import { Router } from "express";

import { StopController } from "../controllers/stop.controller.js";


export const stopRouter = Router();

stopRouter.get("/", StopController.instance.handleFindStops);
stopRouter.get("/:id", StopController.instance.handleGetStopById);

