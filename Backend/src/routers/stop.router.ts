import { Router } from "express";

import { StopController } from "../controllers/stop.controller.js";


export const stopRouter = Router();
const stopController: StopController = StopController.instance;

stopRouter.get("/", stopController.handleFindStops.bind(stopController));
stopRouter.get("/:id", stopController.handleGetStopById.bind(stopController));
stopRouter.get("/:id/routes", stopController.handleGetRoutesByStopId.bind(stopController));

