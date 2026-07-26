import { Service } from "../core/service.js";
import { type Route } from "../db/schema.js";
import { NotFoundError } from "../errors/errors.js";
import type { RouteRepository } from "../repositories/route.repository.js";
import type { StopRepository } from "../repositories/stop.repository.js";


export class RouteService extends Service {

	constructor(
		
		private routeRepository: RouteRepository,
		private stopRepository: StopRepository

	) {

		super();

	}

	async getRoutesByName(name: string, limit: number = 10): Promise<Route[]> {

		return this.routeRepository.getByName(name, limit);

	}

	async getRouteById(id: string): Promise<Route> {

		const route = await this.routeRepository.getById(id);

		if (route == null) {

			throw new NotFoundError(`Route ${id} not found`);

		}

		return route;

	} 

	async getRoutesByStopId(stopId: string): Promise<Route[]> {

		if (!await this.stopRepository.exists(stopId)) {

			throw new NotFoundError(`Stop ${stopId} not found`);

		}

		return this.routeRepository.getByStopId(stopId);

	}

}
