import { eq, and, getTableColumns } from "drizzle-orm";
import { Service } from "../core/service.js";
import { db } from "../db/client.js";
import { calendarDatesTable, stopTimesTable, tripsTable, type Trip } from "../db/schema.js";
import { today } from "../utils/gtfs-time.js";
import { NotFoundError } from "../errors/errors.js";
import { StopService } from "./stop.service.js";
import { RouteService } from "./route.service.js";


export class TripService extends Service {

	async getTodayTripsByStopId(stopId: string): Promise<Trip[]> {

		const date = today();

		return this.getTripsByStopId(stopId, date);

	}
	
	async getTripsByStopId(stopId: string, date: string): Promise<Trip[]> {

		const stopService: StopService = StopService.instance;
		await stopService.getStopById(stopId);

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

		if (result == null) {

			throw new NotFoundError(`Trip ${id} not found`);

		}

		return result;
			
	}

	async getTripsByRouteId(routeId: string): Promise<Trip[]> {

		const routeService: RouteService = RouteService.instance;
		await routeService.getRouteById(routeId);

		const result = await db
			.select()
			.from(tripsTable)
			.where(eq(tripsTable.routeId, routeId));

		return result;

	}

}
