import { and, eq, getTableColumns, like } from "drizzle-orm";
import { Service } from "../core/service.js";
import { db } from "../db/client.js";
import { calendarDatesTable, routesTable, stopTimesTable, tripsTable, type Route } from "../db/schema.js";
import { NotFoundError } from "../errors/errors.js";
import { today } from "../utils/gtfs-time.js";
import { StopService } from "./stop.service.js";


export class RouteService extends Service {

	async getRoutesByName(name: string, limit: number = 10): Promise<Route[]> {

		const result = await db
			.select()
			.from(routesTable)
			.where(
				like(routesTable.routeLongName, `%${name}%`)
			).limit(limit);

		return result;

	}

	async getRouteById(id: string): Promise<Route> {

		const [result] = await db
			.select()
			.from(routesTable)
			.where(eq(routesTable.id, id));

		if (result == null) {

			throw new NotFoundError(`Route ${id} not found`);

		}

		return result;

	} 

	async getRoutesByStopId(stopId: string): Promise<Route[]> {

		const stopService: StopService = StopService.instance;
		await stopService.getStopById(stopId);

		const date = today();

		const result = await db
			.selectDistinct({
				...getTableColumns(routesTable)
			})
			.from(tripsTable)
			.innerJoin(stopTimesTable, eq(stopTimesTable.tripId, tripsTable.id))
			.innerJoin(calendarDatesTable, eq(calendarDatesTable.id, tripsTable.serviceId))
			.innerJoin(routesTable, eq(routesTable.id, tripsTable.routeId))
			.where(
				and(	
					eq(stopTimesTable.stopId, stopId),
					eq(calendarDatesTable.date, date)
				)
			);

		return result;

	}

}
