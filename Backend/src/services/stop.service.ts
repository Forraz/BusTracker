import { Service } from "../core/service.js";
import type { Coordinates } from "../models/coordinates.js";
import { db } from "../db/client.js";
import { stopsTable } from "../db/schema.js";

import { and, between, like } from "drizzle-orm";

export class StopService extends Service {

	async getStopsByName(name: string, limit: number = 10) {

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

	private getSquaredDistance(lPosition: Coordinates, rPosition: Coordinates): number {

		const squaredDistance = Math.pow(rPosition.lat - lPosition.lat, 2) + Math.pow(rPosition.lon - lPosition.lon, 2);

		return squaredDistance;

	}

} 
