import type { Coordinates } from "../types/coordinates.js";
import type { Stop } from "../db/schema.js";
import { mapManyToDTO } from "./mapper.js";

export type StopDTO = {

	id: string,
	name: string,
	coordinates: Coordinates

}

export function mapStopToDTO(stop: Stop): StopDTO {

	if (stop.stopLat == null || stop.stopLon == null) {

		throw new Error(`Stop ${stop.id} is missing coordinates`);

	}

	const dto: StopDTO = {

		id: stop.id,
		name: stop.stopName ?? "Unnamed Station",
		coordinates: {
			lat: stop.stopLat,
			lon: stop.stopLon
		}

	};

	return dto;
	
}

export function mapStopsToDTO(stops: Stop[]): StopDTO[] {

	return mapManyToDTO<Stop, StopDTO>(

		stops,
		mapStopToDTO,
		"Stop",
		(s) => { return { id: s.id }}

	);

}
