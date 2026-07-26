import { eq } from "drizzle-orm";
import { Repository } from "../core/repository.js";
import { tripsTable, type Trip } from "../db/schema.js";


export class TripRepository extends Repository {

	async exists(id: string): Promise<boolean> {

		const trip = await this.getById(id);

		return trip != null;

	}

	async getById(id: string): Promise<Trip | null> {

		const result = await this.database.db
			.select()
			.from(tripsTable)
			.where(eq(tripsTable.id, id))

		return result[0] ?? null;
			
	}

	async getByRouteId(routeId: string): Promise<Trip[]> {

		const result = await this.database.db
			.select()
			.from(tripsTable)
			.where(eq(tripsTable.routeId, routeId));

		return result;

	}


}
