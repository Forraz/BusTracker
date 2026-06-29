import type { Coordinates } from "../types/coordinates.js";
import type { Stop } from "../db/schema.js";

export interface StopDTO {

	id: string,
	name: string,
	coordinates: Coordinates

}

export function mapStopToDTO(stop: Stop): StopDTO {

	const stopName: string = stop.stopName == null ? "Unnamed station" : stop.stopName;

	if (stop.stopLat == null || stop.stopLon == null) {

		throw new Error(`Stop ${stop.id} is missing coordinates`);

	}

	const dto: StopDTO = {

		id: stop.id,
		name: stopName,
		coordinates: {
			lat: stop.stopLat,
			lon: stop.stopLon
		}

	};

	return dto;
	
}
