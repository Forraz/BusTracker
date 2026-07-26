import { and, eq, getTableColumns, like } from "drizzle-orm";
import { Repository } from "../core/repository.js";
import { calendarDatesTable, routesTable, stopTimesTable, tripsTable, type Route } from "../db/schema.js";
import { today } from "../utils/gtfs-time.js";


export class RouteRepository extends Repository {

	async exists(id: string): Promise<boolean> {

		const route = await this.getById(id);

		return route != null;

	}

	async getById(id: string): Promise<Route | null> {

		const result = await this.database.db
			.select()
			.from(routesTable)
			.where(eq(routesTable.id, id));

		return result[0] ?? null;

	} 

	async getByName(name: string, limit: number = 10): Promise<Route[]> {

		const result = await this.database.db
			.select()
			.from(routesTable)
			.where(
				like(routesTable.routeLongName, `%${name}%`)
			).limit(limit);

		return result;

	}

	async getByStopId(stopId: string): Promise<Route[]> {

		const date = today();

		const result = await this.database.db
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
