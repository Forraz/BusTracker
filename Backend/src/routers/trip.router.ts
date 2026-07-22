import { Router } from "express";

import { TripController } from "../controllers/trip.controller.js";


export const tripRouter = Router();

const tripController: TripController = TripController.instance;

tripRouter.get("/:id", tripController.handleGetTripById.bind(tripController));
tripRouter.get("/:id/vehicle", tripController.handleGetVehicleByTripId.bind(tripController));
tripRouter.get("/:id/shape", tripController.handleGetShapeByTripId.bind(tripController));
tripRouter.get("/:id/stops", tripController.handleGetStopsByTripId.bind(tripController));
