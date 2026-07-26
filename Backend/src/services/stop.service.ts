import { Service } from "../core/service.js";
import { type Stop } from "../db/schema.js";
import { NotFoundError } from "../errors/errors.js";
import type { RouteRepository } from "../repositories/route.repository.js";
import type { StopRepository } from "../repositories/stop.repository.js";
import type { TripRepository } from "../repositories/trip.repository.js";

export class StopService extends Service {

	constructor(

		private stopRepository: StopRepository,
		private routeRepository: RouteRepository,
		private tripRepository: TripRepository


	) {

		super();

	}

	async getStopsByName(name: string, limit: number = 10): Promise<Stop[]> {

		return this.stopRepository.getByName(name, limit);

	}

	async getStopById(id: string): Promise<Stop> {

		const stop = await this.stopRepository.getById(id);

		if (stop == null) {

			throw new NotFoundError(`Stop ${id} not found`);

		}

		return stop;

	}

	async getStopsByRouteId(routeId: string) {

		if (!await this.routeRepository.exists(routeId)) {

			throw new NotFoundError(`Route ${routeId} not found`);

		}

		return this.stopRepository.getByRouteId(routeId);

	}

	async getStopsByTripId(tripId: string): Promise<Stop[]> {

		if (!await this.tripRepository.exists(tripId)) {

			throw new NotFoundError(`Trip ${tripId} not found`);

		}

		return this.stopRepository.getByTripId(tripId);

	}

} 
