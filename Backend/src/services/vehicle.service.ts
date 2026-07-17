import { Service } from "../core/service.js";
import type { VehiclePosition } from "../types/gtfs.js";
import type { Trip } from "../db/schema.js";
import { GTFSRtService } from "./gtfs-rt.service.js";
import { TripService } from "./trip.service.js";
import { NotFoundError } from "../errors/errors.js";
import { RouteService } from "./route.service.js";

export class VehicleService extends Service {

	async getVehiclesByRouteId(routeId: string): Promise<VehiclePosition[]> {

		const tripService: TripService = TripService.instance;
		const trips = await tripService.getTripsByRouteId(routeId);

		const routeService: RouteService = RouteService.instance;
		await routeService.getRouteById(routeId);

		const vehicles = this.filterVehiclesByTrips(trips);

		return vehicles;

	}

	filterVehiclesByTrips(trips: Trip[]): VehiclePosition[] {

		const gtfGTFSRtService: GTFSRtService = GTFSRtService.instance;
		const vehiclePositions: VehiclePosition[] = gtfGTFSRtService.getVehiclePositions();

		const tripIds = trips.map((t) => t.id.toString());

		const filteredVehicles = vehiclePositions.filter((v) => {

			if (!v.trip || !v.trip.tripId) { return false; }
			
			return tripIds.includes(v.trip.tripId);

		});

		return filteredVehicles;

	}

	async getVehicleByTripId(id: string): Promise<VehiclePosition> {

		const gtfGTFSRtService: GTFSRtService = GTFSRtService.instance;
		const vehiclePositions: VehiclePosition[] = gtfGTFSRtService.getVehiclePositions();

		const tripService: TripService = TripService.instance;
		await tripService.getTripById(id);

		const vehicle = vehiclePositions.find((v) => v.trip?.tripId === id);

		if (vehicle == null) {

			throw new NotFoundError("Vehicle not found");

		}

		return vehicle;

	}

}
