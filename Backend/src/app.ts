import "dotenv/config";
import { type Express }  from "express";
import express from "express";
import swaggerUI from "swagger-ui-express";

import { handleErrors } from "./middleware/handleErrors.js";
import { logger } from "./utils/logger.js";
import { Database } from "./db/client.js";

import openapi from "../docs/openapi.json" with { type: "json" };

import type { Worker } from "./core/worker.js";
import { GTFSRtWorker } from "./workers/gtfs-rt.worker.js";
import { GTFSImportWorker } from "./workers/gtfs-import.worker.js";
import { GTFSUpdateWorker } from "./workers/gtfs-updater.worker.js";

import { StopRepository } from "./repositories/stop.repository.js";
import { TripRepository } from "./repositories/trip.repository.js";
import { RouteRepository } from "./repositories/route.repository.js";
import { VehicleRepository } from "./repositories/vehicle.repository.js";
import { ShapeRepository } from "./repositories/shape.repository.js";

import { StopService } from "./services/stop.service.js";
import { TripService } from "./services/trip.service.js";
import { RouteService } from "./services/route.service.js";
import { VehicleService } from "./services/vehicle.service.js";
import { ShapeService } from "./services/shape.service.js";

import { StopController } from "./controllers/stop.controller.js";
import { RouteController } from "./controllers/route.controller.js";
import { ShapeController } from "./controllers/shape.controller.js";
import { TripController } from "./controllers/trip.controller.js";

import { createStopRouter } from "./routers/stop.router.js";
import { createRouteRouter } from "./routers/route.router.js";
import { createShapeRouter } from "./routers/shape.router.js";
import { createTripRouter } from "./routers/trip.router.js";

import { GTFSUpdater } from "./gtfs/gtfs.updater.js";
import { GTFSImporter } from "./gtfs/gtfs.importer.js";
import { type GTFSRtProvider } from "./gtfs/gtfs-rt.store.js";


export class App {

	private workers: Worker[] = [];
	public app: Express;

	constructor(

		database: Database,
		gtfsRtProvider: GTFSRtProvider,
		private port: number = 3000

	) {

		const stopRepository = new StopRepository(database);
		const tripRepository = new TripRepository(database);
		const routeRepository = new RouteRepository(database);
		const vehicleRepository = new VehicleRepository(database, gtfsRtProvider);
		const shapeRepository = new ShapeRepository(database);
		
		const stopService = new StopService(

			stopRepository,
			routeRepository,
			tripRepository

		);

		const tripService = new TripService(

			tripRepository,
			routeRepository

		);

		const routeService = new RouteService(

			routeRepository,
			stopRepository

		);

		const vehicleService = new VehicleService(

			vehicleRepository,
			tripRepository,
			routeRepository

		);

		const shapeService = new ShapeService(
			
			shapeRepository,
			tripRepository

		);

		const stopController = new StopController(

			stopService,
			routeService

		);

		const tripController = new TripController(

			tripService,
			vehicleService,
			shapeService,
			stopService

		);

		const routeController = new RouteController(

			routeService,
			stopService,
			vehicleService

		);

		const shapeController = new ShapeController(

			shapeService

		);

		const stopRouter = createStopRouter(stopController);
		const tripRouter = createTripRouter(tripController);
		const routeRouter = createRouteRouter(routeController);
		const shapeRouter = createShapeRouter(shapeController);

		const gtfsUpdater = new GTFSUpdater();
		const gtfsUpdateWorker = new GTFSUpdateWorker(gtfsUpdater);
		this.workers.push(gtfsUpdateWorker);

		const gtfsRtWorker = new GTFSRtWorker(gtfsRtProvider, gtfsUpdater.events);
		this.workers.push(gtfsRtWorker);

		const gtfsImporter = new GTFSImporter(database);
		const gtfsImportWorker = new GTFSImportWorker(gtfsImporter, gtfsUpdater.events);
		this.workers.push(gtfsImportWorker);

		this.app = express();

		this.app.use("/api/docs", swaggerUI.serve, swaggerUI.setup(openapi));
		this.app.use("/api/stops", stopRouter);
		this.app.use("/api/trips", tripRouter);
		this.app.use("/api/routes", routeRouter);
		this.app.use("/api/shapes", shapeRouter);
		this.app.use(handleErrors);


	}

	start() {

		this.startWorkers();

		this.app.listen(this.port, () => {

			logger.info(`Listening on port ${this.port}`);

		});

	}

	startWorkers() {

		this.workers.forEach(w => w.start());

	}

	stopWorkers() {

		this.workers.forEach(w => w.stop());

	}

}


