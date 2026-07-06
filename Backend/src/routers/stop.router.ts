import { Router } from "express";

import { StopController } from "../controllers/stop.controller.js";


export const stopRouter = Router();

stopRouter.get("/", StopController.instance.handleGetStops);

