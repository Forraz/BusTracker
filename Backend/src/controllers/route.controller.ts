import type { Request, Response, NextFunction } from "express";

import { Controller } from "../core/controller.js";
import { type RouteDTO, mapRouteToDTO } from "../dto/route.dto.js";
import { type Route } from "../db/schema.js";
import { RouteService } from "../services/route.service.js";

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

}
