import type { Request, Response, NextFunction } from "express";

import { Controller } from "../core/controller.js";
import { type RouteDTO, mapRouteToDTO, mapRoutesToDTO } from "../dto/route.dto.js";
import { type StopDTO, mapStopsToDTO } from "../dto/stop.dto.js";
import { type VehicleDTO, mapVehiclesToDTO } from "../dto/vehicle.dto.js";
import type { Route, Stop } from "../db/schema.js";
import { RouteService } from "../services/route.service.js";
import { StopService } from "../services/stop.service.js";
import { VehicleService } from "../services/vehicle.service.js";
import type { VehiclePosition } from "../types/gtfs.js";
import { BadRequestError } from "../errors/errors.js";


interface RouteIdParams {

	id: string

}

interface FindRoutesQuery {

	name?: string,
	limit?: number

}

export class RouteController extends Controller {

	constructor(

		private readonly routeService: RouteService = RouteService.instance,
		private readonly vehicleService: VehicleService = VehicleService.instance,
		private readonly stopService: StopService = StopService.instance

	) {

		super();

	}

	public async handleFindRoutes(req: Request<{}, {}, {}, FindRoutesQuery>, res: Response, next: NextFunction) {

		if (!req.query.name) {

			throw new BadRequestError("Missing a query parameter: name");

		}

		const limit = Number(req.query.limit) || 10;

		const resultsByName: Route[] = await this.routeService.getRoutesByName(req.query.name, limit);
		const routes: RouteDTO[] = mapRoutesToDTO(resultsByName);

		const responseData = {

			routes: routes

		};

		res.status(200).json(responseData);

	}

	public async handleGetRouteById(req: Request<RouteIdParams>, res: Response, next: NextFunction) {

		const route: Route = await this.routeService.getRouteById(req.params.id);
		const routeDTO: RouteDTO = mapRouteToDTO(route);

		const responseData = {

			route: routeDTO

		};

		res.status(200).json(responseData);

	}

	public async handleGetStopsByRouteId(req: Request<RouteIdParams>, res: Response, next: NextFunction) {

		const results: Stop[] = await this.stopService.getStopsByRouteId(req.params.id);

		const stops: StopDTO[] = mapStopsToDTO(results);

		const responseData = {

			stops: stops

		};

		res.status(200).json(responseData);

	}

	public async handleGetVehiclesByRouteId(req: Request<RouteIdParams>, res: Response, next: NextFunction) {

		const results: VehiclePosition[] = await this.vehicleService.getVehiclesByRouteId(req.params.id);

		const vehicles: VehicleDTO[] = mapVehiclesToDTO(results);

		const responseData = {

			vehicles: vehicles

		};

		res.status(200).json(responseData);

	}

}
