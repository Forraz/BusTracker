import { Controller } from "../core/controller.js";
import type { Request, Response, NextFunction } from "express";
import { TripService } from "../services/trip.service.js";
import { mapTripToDTO, type TripDTO } from "../dto/trip.dto.js";
import { VehicleService } from "../services/vehicle.service.js";
import { mapVehicleToDTO, type VehicleDTO } from "../dto/vehicle.dto.js";
import type { VehiclePosition } from "../types/gtfs.js";
import { ShapeService } from "../services/shape.service.js";
import { type ShapeDTO, mapShapeToDTO } from "../dto/shape.dto.js";
import type { Shape, Stop } from "../db/schema.js";
import { StopService } from "../services/stop.service.js";
import { type StopDTO, mapStopToDTO } from "../dto/stop.dto.js";

interface TripIdParams {

	id: string

}

export class TripController extends Controller {

	async handleGetTripById(req: Request<TripIdParams>, res: Response, next: NextFunction) {

		const tripService: TripService = TripService.instance;

		const tripId = req.params.id;

		if (tripId == null) {

			return;

		}

		const trip = await tripService.getTripById(tripId);
		const tripDTO: TripDTO = mapTripToDTO(trip);

		const responseData = {

			trip: tripDTO

		};

		res.status(200).json(responseData);

	}

	async handleGetVehicleByTripId(req: Request<TripIdParams>, res: Response, next: NextFunction) {

		const vehicleService: VehicleService = VehicleService.instance;

		const tripId = req.params.id;

		if (tripId == null) {

			return;

		}

		const vehicle: VehiclePosition = await vehicleService.getVehicleByTripId(tripId);
		const vehicleDTO: VehicleDTO = mapVehicleToDTO(vehicle);

		const responseData = {

			vehicle: vehicleDTO

		};

		res.status(200).json(responseData);

	}

	async handleGetShapeByTripId(req: Request<TripIdParams>, res: Response, next: NextFunction) {

		const shapeService: ShapeService = ShapeService.instance;

		const tripId = req.params.id;

		if (tripId == null) {

			return;

		}

		const shape: Shape[] = await shapeService.getShapeByTripId(tripId);
		const shapeDTO: ShapeDTO = mapShapeToDTO(shape);

		const responseData = {

			shape: shapeDTO

		};

		res.status(200).json(responseData);

	}

	async handleGetStopsByTripId(req: Request<TripIdParams>, res: Response, next: NextFunction) {

		const tripId = req.params.id;

		const tripService: TripService = TripService.instance;
		await tripService.getTripById(tripId);

		const stopService: StopService = StopService.instance;

		const results: Stop[] = await stopService.getStopsByTripId(tripId);

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
