import { Router } from "express";

import { StopController } from "../controllers/stop.controller.js";


export function createStopRouter(stopController: StopController): Router {

	const stopRouter = Router();

	stopRouter.get("/", stopController.handleFindStops.bind(stopController));
	stopRouter.get("/:id", stopController.handleGetStopById.bind(stopController));
	stopRouter.get("/:id/routes", stopController.handleGetRoutesByStopId.bind(stopController));

	return stopRouter;

}

