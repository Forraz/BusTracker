import type { Request, Response } from "express";

import { Controller } from "../core/controller.js";
import { StopService } from "../services/stop.service.js";
import { type Stop, type Trip } from "../db/schema.js";
import { mapStopToDTO, type StopDTO } from "../dto/stop.dto.js";
import { mapTripToDTO, type TripDTO } from "../dto/trip.dto.js";
import { TripService } from "../services/trip.service.js";

interface StopIdParams {

	id: string

}

export class StopController extends Controller {

	public async handleFindStops(req: Request, res: Response) {

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

	public async handleGetStopById(req: Request<StopIdParams>, res: Response) {

		const stopService: StopService = StopService.instance;

		const stopId = req.params.id;

		const stop: Stop = await stopService.getStopById(stopId);
		const stopDTO: StopDTO = mapStopToDTO(stop);

		const responseData = {

			stop: stopDTO

		};

		res.status(200).json(responseData);

	}

	public async handleGetTripsByStopId(req: Request<StopIdParams>, res: Response) {

		const tripService: TripService = TripService.instance;

		const stopId = req.params.id;

		const results: Trip[] = await tripService.getTodayTripsByStopId(stopId);
		const trips: TripDTO[] = results.map((trip) => {

			let tripDTO: TripDTO;

			try {

				tripDTO = mapTripToDTO(trip);

			} catch (e) {

				console.warn("Failed to map trip to DTO: ", {
					tripId: trip.id,
					error: e
				});

				return null;

			}

			return tripDTO;

		}).filter((dto) => dto != null);


		const responseData = {

			trips: trips

		};

		res.status(200).json(responseData);

	}

}
