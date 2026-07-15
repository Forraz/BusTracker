import { Router } from "express";
import { RouteController } from "../controllers/route.controller.js";


export const routeRouter = Router();

const routeController: RouteController = RouteController.instance;

routeRouter.get("/:id", routeController.handleGetRouteById);
routeRouter.get("/:id/stops", routeController.handleGetStopsByRouteId);
