import { Service } from "../core/service.js";
import type { Coordinates } from "../types/coordinates.js";
import { db } from "../db/client.js";
import { stopsTable, stopTimesTable, tripsTable, type Stop } from "../db/schema.js";
import { NotFoundError } from "../errors/errors.js";
import { and, between, eq, getTableColumns, like } from "drizzle-orm";
import { RouteService } from "./route.service.js";
import { TripService } from "./trip.service.js";

export class StopService extends Service {

	async getStopsByName(name: string, limit: number = 10): Promise<Stop[]> {

		const result = await db
		.select()
		.from(stopsTable)
		.where(
			like(stopsTable.stopName, `%${name}%`)
		).limit(limit);

		return result;

	}

	async getNearestStopsByPosition(position: Coordinates, limit: number = 10, radius: number = 0.15) {

		const minCoordinates: Coordinates = { lat: position.lat-radius/2, lon: position.lon-radius/2 };
		const maxCoordinates: Coordinates = { lat: position.lat+radius/2, lon: position.lon+radius/2 };

		const result = await db
			.select()
			.from(stopsTable)
			.where(
				and(
					between(stopsTable.stopLat, minCoordinates.lat, maxCoordinates.lat),
					between(stopsTable.stopLon, minCoordinates.lon, maxCoordinates.lon)
				)
			).limit(limit);

		result.sort((a, b) => {

			const aCoordinates: Coordinates = { lat: a.stopLat!, lon: a.stopLon! };
			const bCoordinates: Coordinates = { lat: b.stopLat!, lon: b.stopLon! };

			const aDistance = this.getSquaredDistance(position, aCoordinates);
			const bDistance = this.getSquaredDistance(position, bCoordinates);

			return aDistance - bDistance;

		});

		return result;

	}

	async getStopById(id: string): Promise<Stop> {

		const [result] = await db
			.select()
			.from(stopsTable)
			.where(eq(stopsTable.id, id))

		if (result == null) {

			throw new NotFoundError(`Stop ${id} not found`);

		}

		return result;

	}

	async getStopsByRouteId(routeId: string) {

		const routeService: RouteService = RouteService.instance;
		await routeService.getRouteById(routeId);

		const stops: Stop[] = await db
			.selectDistinct({
				...getTableColumns(stopsTable)
			})
			.from(stopTimesTable)
			.innerJoin(stopsTable, eq(stopTimesTable.stopId, stopsTable.id))
			.innerJoin(tripsTable, eq(stopTimesTable.tripId, tripsTable.id))
			.where(
				eq(tripsTable.routeId, routeId)
			)

		return stops;

	}

	async getStopsByTripId(tripId: string): Promise<Stop[]> {

		const tripService: TripService = TripService.instance;
		await tripService.getTripById(tripId);

		const stops: Stop[] = await db
			.select({
				...getTableColumns(stopsTable)
			})
			.from(stopTimesTable)
			.innerJoin(stopsTable, eq(stopTimesTable.stopId, stopsTable.id))
			.innerJoin(tripsTable, eq(stopTimesTable.tripId, tripsTable.id))
			.where(
				eq(tripsTable.id, tripId)
			)

		return stops;


	}

	private getSquaredDistance(lPosition: Coordinates, rPosition: Coordinates): number {

		const squaredDistance = Math.pow(rPosition.lat - lPosition.lat, 2) + Math.pow(rPosition.lon - lPosition.lon, 2);

		return squaredDistance;

	}

} 
