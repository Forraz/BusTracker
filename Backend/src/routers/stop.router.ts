import { Router } from "express";

import { StopController } from "../controllers/stop.controller.js";


const stopRouter = Router();

stopRouter.get("/", StopController.instance.handleGetStops);

export default stopRouter;
