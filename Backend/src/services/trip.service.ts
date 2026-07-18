import { eq } from "drizzle-orm";
import { Service } from "../core/service.js";
import { db } from "../db/client.js";
import { tripsTable, type Trip } from "../db/schema.js";
import { NotFoundError } from "../errors/errors.js";
import { RouteService } from "./route.service.js";


export class TripService extends Service {

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
