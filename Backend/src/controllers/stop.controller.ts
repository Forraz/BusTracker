import type { Request, Response } from "express";

import { Controller } from "../core/controller.js";
import { StopService } from "../services/stop.service.js";
import { type Stop } from "../db/schema.js";
import { mapStopToDTO, type StopDTO } from "../dto/stop.dto.js";


export class StopController extends Controller {

	public async handleGetStops(req: Request, res: Response) {

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

}
