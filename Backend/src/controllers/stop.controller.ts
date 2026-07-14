import type { Request, Response } from "express";

import { Controller } from "../core/controller.js";
import { StopService } from "../services/stop.service.js";
import { type Stop } from "../db/schema.js";
import { mapStopToDTO, type StopDTO } from "../dto/stop.dto.js";

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

}
