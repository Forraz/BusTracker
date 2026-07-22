import type { VehiclePosition } from "../types/gtfs.js";
import type { Coordinates } from "../types/coordinates.js";
import { mapManyToDTO } from "./mapper.js";

export interface VehicleDTO {

	tripId: string,
	routeId: string,
	position: Coordinates

}

export function mapVehicleToDTO(vehicle: VehiclePosition): VehicleDTO {

	const trip = vehicle.trip;
	const position = vehicle.position;

	if (trip == null) {

		throw new Error("Vehicle is missing a trip");

	} else if (trip.tripId == null) {

		throw new Error("Vehicle is missing a trip id");

	} else if (trip.routeId == null) {

		throw new Error("Vehicle is missing a route id");

	}

	if (position == null) {

		throw new Error("Vehicle is missing a position");

	}

	const dto: VehicleDTO = {

		tripId: trip.tripId,
		routeId: trip.routeId,
		position: {
			lon: position.longitude,
			lat: position.latitude
		}

	};

	return dto;

}

export function mapVehiclesToDTO(vehicles: VehiclePosition[]): VehicleDTO[] {

	return mapManyToDTO<VehiclePosition, VehicleDTO>(

		vehicles,
		mapVehicleToDTO,
		"Vehicle",
		(v) => { return { tripId: v.trip?.tripId ?? "Unknown" }}

	);

}
