import { eq, getTableColumns } from "drizzle-orm";
import { Service } from "../core/service.js";
import { db } from "../db/client.js";
import { shapesTable, tripsTable, type Shape } from "../db/schema.js";
import { NotFoundError } from "../errors/errors.js";


export class ShapeService extends Service {

	async getShapeById(id: string): Promise<Shape[]> {

		const result = await db
			.select()
			.from(shapesTable)
			.where(eq(shapesTable.id, id));

		if (result.length == 0) {

			throw new NotFoundError(`Shape ${id} not found`);

		}

		return result;

	}

	async getShapeByTripId(tripId: string): Promise<Shape[]> {

		const result = await db
			.select({
				...getTableColumns(shapesTable)
			})
			.from(shapesTable)
			.innerJoin(tripsTable, eq(shapesTable.id, tripsTable.shapeId))
			.where(eq(tripsTable.id, tripId));

		return result;


	}
}
