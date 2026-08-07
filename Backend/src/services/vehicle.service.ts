import { Service } from "../core/service.js";
import type { VehiclePosition } from "../types/gtfs.js";
import type { Trip } from "../db/schema.js";
import { NotFoundError } from "../errors/errors.js";
import type { VehicleRepository } from "../repositories/vehicle.repository.js";
import type { TripRepository } from "../repositories/trip.repository.js";
import type { RouteRepository } from "../repositories/route.repository.js";

export class VehicleService extends Service {

	constructor(

		private vehicleRepository: VehicleRepository,
		private tripRepository: TripRepository,
		private routeRepository: RouteRepository

	) {

		super();

	}

	async getVehiclesByRouteId(routeId: string): Promise<VehiclePosition[]> {

		
		if(!await this.routeRepository.exists(routeId)) {

			throw new NotFoundError(`Route ${routeId} not found`);

		}
		
		const trips = await this.tripRepository.getByRouteId(routeId);

		const vehicles = this.filterVehiclesByTrips(trips);

		return vehicles;

	}

	filterVehiclesByTrips(trips: Trip[]): VehiclePosition[] {

		return this.vehicleRepository.filterByTrips(trips);

	}

	async getVehicleByTripId(tripId: string): Promise<VehiclePosition> {

		if(!await this.tripRepository.exists(tripId)) {

			throw new NotFoundError(`Trip ${tripId} not found`);

		}

		const vehicle = await this.vehicleRepository.getByTripId(tripId);

		if (vehicle == null) {

			throw new NotFoundError("Vehicle not found");

		}

		return vehicle;

	}

}
