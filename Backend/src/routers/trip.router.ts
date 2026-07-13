import { Router } from "express";
import { TripController } from "../controllers/trip.controller.js";


export const tripRouter = Router();

const tripController: TripController = TripController.instance;

tripRouter.get("/:id", tripController.handleGetTripById);

