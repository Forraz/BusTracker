import { Service } from "../core/service.js";
import { type Trip } from "../db/schema.js";
import { NotFoundError } from "../errors/errors.js";
import type { RouteRepository } from "../repositories/route.repository.js";
import type { TripRepository } from "../repositories/trip.repository.js";


export class TripService extends Service {

	constructor(

		private tripRepository: TripRepository,
		private routeRepository: RouteRepository

	) {

		super();

	}

	async getTripById(id: string): Promise<Trip> {
		
		const stop = await this.tripRepository.getById(id);

		if (stop == null) {

			throw new NotFoundError(`Trip ${id} not found`);

		}

		return stop;
			
	}

	async getTripsByRouteId(routeId: string): Promise<Trip[]> {

		if (!await this.routeRepository.exists(routeId)) {

			throw new NotFoundError(`Route ${routeId} not found`);

		}

		return this.tripRepository.getByRouteId(routeId);

	}

}
