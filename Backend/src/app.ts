import "dotenv/config";
import express from "express"
import swaggerUI from "swagger-ui-express";

import { stopRouter } from "./routers/stop.router.js";
import { GTFSApiService } from "./services/gtfs-api.service.js";
import { tripRouter } from "./routers/trip.router.js";
import { handleErrors } from "./middleware/handleErrors.js";
import { routeRouter } from "./routers/route.router.js";
import { shapeRouter } from "./routers/shape.router.js";
import { logger } from "./utils/logger.js";
import openapi from "../docs/openapi.json" with { type: "json" };
import { GTFSImportWorker } from "./workers/gtfs-import.worker.js";
import { GTFSRtWorker } from "./workers/gtfs-rt.worker.js";
import { GTFSApiWorker } from "./workers/gtfs-api.worker.js";
import { GTFSRtService } from "./services/gtfs-rt.service.js";
import { GTFSImportService } from "./services/gtfs-import.service.js";


const app = express();
const port = 3000;

const gtfsApiService: GTFSApiService = GTFSApiService.instance;
const gtfsApiWorker = new GTFSApiWorker(gtfsApiService);
gtfsApiWorker.start();

const gtfsRtService: GTFSRtService = GTFSRtService.instance;
console.log(gtfsRtService);
const gtfsRtWorker = new GTFSRtWorker(gtfsRtService, gtfsApiService.events);
gtfsRtWorker.start();

const gtfsImportService: GTFSImportService = GTFSImportService.instance;
const gtfsImportWorker = new GTFSImportWorker(gtfsImportService, gtfsApiService.events);
gtfsImportWorker.start();

app.use("/docs", swaggerUI.serve, swaggerUI.setup(openapi));
app.use("/api/stops", stopRouter);
app.use("/api/trips", tripRouter);
app.use("/api/routes", routeRouter);
app.use("/api/shapes", shapeRouter);
app.use(handleErrors);

app.listen(port, () => {

	logger.info(`Listening on port ${port}`);

});


