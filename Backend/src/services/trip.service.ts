import { eq, and, getTableColumns } from "drizzle-orm";
import { Service } from "../core/service.js";
import { db } from "../db/client.js";
import { calendarDatesTable, stopTimesTable, tripsTable, type Trip } from "../db/schema.js";
import { today } from "../utils/gtfs-time.js";
import { NotFoundError } from "../errors/errors.js";


export class TripService extends Service {

	async getTodayTripsByStopId(stopId: string): Promise<Trip[]> {

		const date = today();

		return this.getTripsByStopId(stopId, date);

	}
	
	async getTripsByStopId(stopId: string, date: string): Promise<Trip[]> {

		const result = await db
			.select({
				...getTableColumns(tripsTable)
			})
			.from(tripsTable)
			.innerJoin(stopTimesTable, eq(stopTimesTable.tripId, tripsTable.id))
			.innerJoin(calendarDatesTable, eq(calendarDatesTable.id, tripsTable.serviceId))
			.where(
				and(	
					eq(stopTimesTable.stopId, stopId),
					eq(calendarDatesTable.date, date)
				)
			);

		return result;

	}

	async getTripById(id: string): Promise<Trip> {

		const [result] = await db
			.select()
			.from(tripsTable)
			.where(eq(tripsTable.id, id))

		if (!result) {

			throw new NotFoundError(`Trip ${id} not found`);

		}

		return result;
			
	}

}
