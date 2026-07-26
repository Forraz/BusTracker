import { eq, getTableColumns } from "drizzle-orm";
import { Repository } from "../core/repository.js";
import { shapesTable, tripsTable, type Shape } from "../db/schema.js";


export class ShapeRepository extends Repository {

	async exists(id: string): Promise<boolean> {

		const shape = await this.getById(id);

		return shape != null;

	}

	async getById(id: string): Promise<Shape[] | null> {

		const result = await this.database.db
			.select()
			.from(shapesTable)
			.where(eq(shapesTable.id, id));

		return result.length != 0 ? result : null;

	}

	async getByTripId(tripId: string): Promise<Shape[]> {

		const result = await this.database.db
			.select({
				...getTableColumns(shapesTable)
			})
			.from(shapesTable)
			.innerJoin(tripsTable, eq(shapesTable.id, tripsTable.shapeId))
			.where(eq(tripsTable.id, tripId));

		return result;

	}

}
