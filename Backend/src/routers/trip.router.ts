import { Router } from "express";
import { TripController } from "../controllers/trip.controller.js";


export const tripRouter = Router();

const tripController: TripController = TripController.instance;

tripRouter.get("/:id", tripController.handleGetTripById);
tripRouter.get("/:id/vehicle", tripController.handleGetVehicleByTripId);
tripRouter.get("/:id/shape", tripController.handleGetShapeByTripId);
tripRouter.get("/:id/stops", tripController.handleGetStopsByTripId);
