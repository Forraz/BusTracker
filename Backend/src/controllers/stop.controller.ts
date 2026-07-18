import type { Request, Response, NextFunction } from "express";

import { Controller } from "../core/controller.js";
import { type Route, type Stop, type Trip } from "../db/schema.js";
import { mapStopToDTO, type StopDTO } from "../dto/stop.dto.js";
import { mapTripToDTO, type TripDTO } from "../dto/trip.dto.js";
import { mapVehicleToDTO, type VehicleDTO } from "../dto/vehicle.dto.js";
import { mapRouteToDTO, type RouteDTO } from "../dto/route.dto.js";
import { StopService } from "../services/stop.service.js";
import { TripService } from "../services/trip.service.js";
import { VehicleService } from "../services/vehicle.service.js";
import { RouteService } from "../services/route.service.js";

interface StopIdParams {

	id: string

}

export class StopController extends Controller {

	public async handleFindStops(req: Request, res: Response, next: NextFunction) {

		const stopService: StopService = StopService.instance;

		const query = req.query["query"]?.toString();

		// TODO: Implement request validation  
		if (!query) {

			return;

		}

		const resultsByName: Stop[] = await stopService.getStopsByName(query);
		const stops: StopDTO[] = resultsByName.map((stop) => {

			let stopDTO: StopDTO;

			try {

				stopDTO = mapStopToDTO(stop);

			} catch (e) {

				console.warn("Failed to map stop to DTO: ", {
					stopId: stop.id,
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

	public async handleGetStopById(req: Request<StopIdParams>, res: Response, next: NextFunction) {

		const stopService: StopService = StopService.instance;

		const stopId = req.params.id;

		const stop: Stop = await stopService.getStopById(stopId);
		const stopDTO: StopDTO = mapStopToDTO(stop);

		const responseData = {

			stop: stopDTO

		};

		res.status(200).json(responseData);

	}

	public async handleGetRoutesByStopId(req: Request<StopIdParams>, res: Response, next: NextFunction) {

		const routeService: RouteService = RouteService.instance;

		const stopId = req.params.id;

		const results: Route[] = await routeService.getRoutesByStopId(stopId);
		const routes: RouteDTO[] = results.map((route) => {

			let routeDTO: RouteDTO;

			try {

				routeDTO = mapRouteToDTO(route);

			} catch (e) {

				console.warn("Failed to map route to DTO: ", {
					id: route.id,
					error: e
				});

				return null;

			}

			return routeDTO;

		}).filter((dto) => dto != null);


		const responseData = {

			routes: routes

		};

		res.status(200).json(responseData);

	}

}
