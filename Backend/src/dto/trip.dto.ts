import type { Trip } from "../db/schema.js";

export interface TripDTO {

	id: string,
	routeId: string,
	serviceId: string,
	directionId: number,
	shapeId: string,

}

export function mapTripToDTO(trip: Trip): TripDTO {

	if (trip.routeId == null) {

		throw new Error(`Trip ${trip.id} is missing a route`);

	}

	if (trip.serviceId == null) {

		throw new Error(`Trip ${trip.id} is missing a service`);

	}

	if (trip.directionId == null) {

		throw new Error(`Trip ${trip.id} is missing a direction`);

	}

	if (trip.shapeId == null) {

		throw new Error(`Trip ${trip.id} is missing a shape`);

	}

	const dto: TripDTO = {

		id: trip.id,
		routeId: trip.routeId,
		serviceId: trip.serviceId,
		directionId: trip.directionId,
		shapeId: trip.shapeId,

	};


	return dto;
	
}
