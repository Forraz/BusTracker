import { Router } from "express";

import { TripController } from "../controllers/trip.controller.js";


export function createTripRouter(tripController: TripController): Router {

	const tripRouter = Router();

	tripRouter.get("/:id", tripController.handleGetTripById.bind(tripController));
	tripRouter.get("/:id/vehicle", tripController.handleGetVehicleByTripId.bind(tripController));
	tripRouter.get("/:id/shape", tripController.handleGetShapeByTripId.bind(tripController));
	tripRouter.get("/:id/stops", tripController.handleGetStopsByTripId.bind(tripController));

	return tripRouter;

}
