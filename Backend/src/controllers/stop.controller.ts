import type { Request, Response, NextFunction } from "express";

import { Controller } from "../core/controller.js";
import { type Route, type Stop } from "../db/schema.js";

import { type StopDTO, mapStopToDTO, mapStopsToDTO } from "../dto/stop.dto.js";
import { type RouteDTO, mapRoutesToDTO } from "../dto/route.dto.js";

import { StopService } from "../services/stop.service.js";
import { RouteService } from "../services/route.service.js";
import { BadRequestError } from "../errors/errors.js";


interface StopIdParams {

	id: string

}

export class StopController extends Controller {

	constructor(

		private readonly stopService: StopService = StopService.instance,
		private readonly routeService: RouteService = RouteService.instance

	) {

		super();

	}

	public async handleFindStops(req: Request, res: Response, next: NextFunction) {

		const query = req.query["query"]?.toString();

		if (!query) {

			throw new BadRequestError("Missing a query parameter");

		}

		const resultsByName: Stop[] = await this.stopService.getStopsByName(query);
		const stops: StopDTO[] = mapStopsToDTO(resultsByName);

		const responseData = {

			stops: stops

		};

		res.status(200).json(responseData);

	}

	public async handleGetStopById(req: Request<StopIdParams>, res: Response, next: NextFunction) {

		const stop: Stop = await this.stopService.getStopById(req.params.id);
		const stopDTO: StopDTO = mapStopToDTO(stop);

		const responseData = {

			stop: stopDTO

		};

		res.status(200).json(responseData);

	}

	public async handleGetRoutesByStopId(req: Request<StopIdParams>, res: Response, next: NextFunction) {

		const results: Route[] = await this.routeService.getRoutesByStopId(req.params.id);
		const routes: RouteDTO[] = mapRoutesToDTO(results);

		const responseData = {

			routes: routes

		};

		res.status(200).json(responseData);

	}

}
