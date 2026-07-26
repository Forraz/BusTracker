import type { Database } from "../db/client.js";
import { GeocodingService } from "./geocoding.service.js";
import { GTFSApiService } from "./gtfs-api.service.js";
import { GTFSImportService } from "./gtfs-import.service.js";
import { GTFSRtService } from "./gtfs-rt.service.js";
import { RouteService } from "./route.service.js";
import { ShapeService } from "./shape.service.js";
import { StopService } from "./stop.service.js";
import { TripService } from "./trip.service.js";
import { VehicleService } from "./vehicle.service.js";


export class ServiceContainer {

	public readonly stopService: StopService
	public readonly tripService: TripService
	public readonly shapeService: ShapeService
	public readonly routeService: RouteService
	public readonly vehicleService: VehicleService
	public readonly geocodingService: GeocodingService
	public readonly gtfsApiService: GTFSApiService
	public readonly gtfsImportService: GTFSImportService
	public readonly gtfsRtService: GTFSRtService

	constructor(database: Database) {

		this.stopService = new StopService(database);
		this.tripService = new TripService(database);
		this.shapeService = new ShapeService(database);
		this.routeService = new RouteService(database);
		this.vehicleService = new VehicleService(database);
		this.geocodingService = new GeocodingService(database);
		this.gtfsApiService = new GTFSApiService(database);
		this.gtfsImportService = new GTFSImportService(database);
		this.gtfsRtService = new GTFSRtService(database);

	}

}
