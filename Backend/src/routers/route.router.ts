import { Router } from "express";
import { RouteController } from "../controllers/route.controller.js";


export const routeRouter = Router();

const routeController: RouteController = RouteController.instance;

routeRouter.get("/", routeController.handleFindRoutes.bind(routeController));
routeRouter.get("/:id", routeController.handleGetRouteById.bind(routeController));
routeRouter.get("/:id/stops", routeController.handleGetStopsByRouteId.bind(routeController));
routeRouter.get("/:id/vehicles", routeController.handleGetVehiclesByRouteId.bind(routeController));
