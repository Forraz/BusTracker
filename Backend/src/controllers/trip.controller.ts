import type { Request, Response, NextFunction } from "express";

import { Controller } from "../core/controller.js";
import type { VehiclePosition } from "../types/gtfs.js";
import type { Shape, Stop } from "../db/schema.js";

import { TripService } from "../services/trip.service.js";
import { VehicleService } from "../services/vehicle.service.js";
import { ShapeService } from "../services/shape.service.js";
import { StopService } from "../services/stop.service.js";

import { type TripDTO, mapTripToDTO } from "../dto/trip.dto.js";
import { type VehicleDTO, mapVehicleToDTO } from "../dto/vehicle.dto.js";
import { type ShapeDTO, mapShapeToDTO } from "../dto/shape.dto.js";
import { type StopDTO, mapStopToDTO } from "../dto/stop.dto.js";


interface TripIdParams {

	id: string

}

export class TripController extends Controller {

	constructor(

		private readonly tripService: TripService = TripService.instance,
		private readonly vehicleService: VehicleService = VehicleService.instance,
		private readonly shapeService: ShapeService = ShapeService.instance,
		private readonly stopService: StopService = StopService.instance

	) {

		super();

	}

	async handleGetTripById(req: Request<TripIdParams>, res: Response, next: NextFunction) {

		const trip = await this.tripService.getTripById(req.params.id);
		const tripDTO: TripDTO = mapTripToDTO(trip);

		const responseData = {

			trip: tripDTO

		};

		res.status(200).json(responseData);

	}

	async handleGetVehicleByTripId(req: Request<TripIdParams>, res: Response, next: NextFunction) {

		const vehicle: VehiclePosition = await this.vehicleService.getVehicleByTripId(req.params.id);
		const vehicleDTO: VehicleDTO = mapVehicleToDTO(vehicle);

		const responseData = {

			vehicle: vehicleDTO

		};

		res.status(200).json(responseData);

	}

	async handleGetShapeByTripId(req: Request<TripIdParams>, res: Response, next: NextFunction) {

		const shape: Shape[] = await this.shapeService.getShapeByTripId(req.params.id);
		const shapeDTO: ShapeDTO = mapShapeToDTO(shape);

		const responseData = {

			shape: shapeDTO

		};

		res.status(200).json(responseData);

	}

	async handleGetStopsByTripId(req: Request<TripIdParams>, res: Response, next: NextFunction) {

		const results: Stop[] = await this.stopService.getStopsByTripId(req.params.id);

		const stops: StopDTO[] = results.map((stop) => {

			let stopDTO;

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

}
