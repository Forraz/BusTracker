import { eq, getTableColumns, ilike, like } from "drizzle-orm";
import { Repository } from "../core/repository.js";
import { stopsTable, stopTimesTable, tripsTable, type Stop } from "../db/schema.js";


export class StopRepository extends Repository {

	async exists(id: string): Promise<boolean> {

		const stop = await this.getById(id);

		return stop != null;


	}

	async getById(id: string): Promise<Stop | null> {

		const result = await this.database.db
			.select()
			.from(stopsTable)
			.where(
				eq(stopsTable.id, id)
			);

		const stop = result[0] ?? null;
		
		return stop;

	}

	async getByName(name: string, limit: number = 10): Promise<Stop[]> {

		const result = await this.database.db
			.select()
			.from(stopsTable)
			.where(
				ilike(stopsTable.stopName, `%${name}%`)
			).limit(limit);

		return result;

	}

	async getByRouteId(routeId: string) {

		const stops: Stop[] = await this.database.db
			.selectDistinct({
				...getTableColumns(stopsTable)
			})
			.from(stopTimesTable)
			.innerJoin(stopsTable, eq(stopTimesTable.stopId, stopsTable.id))
			.innerJoin(tripsTable, eq(stopTimesTable.tripId, tripsTable.id))
			.where(
				eq(tripsTable.routeId, routeId)
			);

		return stops;

	}

	async getByTripId(tripId: string): Promise<Stop[]> {

		const stops: Stop[] = await this.database.db
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

}
