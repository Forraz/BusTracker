import { Controller } from "../core/controller.js";
import type { Request, Response } from "express";
import { TripService } from "../services/trip.service.js";
import { mapTripToDTO, type TripDTO } from "../dto/trip.dto.js";

interface TripIdParams {

	id: number

}

export class TripController extends Controller {

	async handleGetTripById(req: Request<TripIdParams>, res: Response) {

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

}
