import type { Request, Response, NextFunction } from "express";

import { Controller } from "../core/controller.js";
import { type RouteDTO, mapRouteToDTO } from "../dto/route.dto.js";
import { type StopDTO, mapStopToDTO } from "../dto/stop.dto.js";
import type { Route, Stop } from "../db/schema.js";
import { RouteService } from "../services/route.service.js";
import { StopService } from "../services/stop.service.js";

interface RouteIdParams {

	id: string

}

export class RouteController extends Controller {

	public async handleGetRouteById(req: Request<RouteIdParams>, res: Response, next: NextFunction) {

		const routeService: RouteService = RouteService.instance;

		const routeId = req.params.id;

		const route: Route = await routeService.getRouteById(routeId);
		const routeDTO: RouteDTO = mapRouteToDTO(route);

		const responseData = {

			route: routeDTO

		};

		res.status(200).json(responseData);

	}

	public async handleGetStopsByRouteId(req: Request<RouteIdParams>, res: Response, next: NextFunction) {

		const stopService: StopService = StopService.instance;

		const routeId = req.params.id;

		const results: Stop[] = await stopService.getStopsByRouteId(routeId);

		const stops: StopDTO[] = results.map((stop) => {

			let stopDTO: StopDTO;

			try {

				stopDTO = mapStopToDTO(stop);

			} catch (e) {

				console.warn("Failed to map stop to DTO: ", {
					id: stop.id,
					error: e
				});

				return null;

			}

			return stopDTO;

		}).filter((dto) => dto != null);

		const responseData = {

			stops: stops

		};

		res.status(200).json(responseData);


	}

}
