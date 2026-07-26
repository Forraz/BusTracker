import { Service } from "../core/service.js";
import { type Shape } from "../db/schema.js";
import { NotFoundError } from "../errors/errors.js";
import type { ShapeRepository } from "../repositories/shape.repository.js";
import type { TripRepository } from "../repositories/trip.repository.js";


export class ShapeService extends Service {

	constructor(

		private shapeRepository: ShapeRepository,
		private tripRepository: TripRepository

	) {

		super();

	}

	async getShapeById(id: string): Promise<Shape[]> {

		const shape = await this.getShapeById(id);

		if (shape == null) {

			throw new NotFoundError(`Shape ${id} not found`);

		}

		return shape;

	}

	async getShapeByTripId(tripId: string): Promise<Shape[]> {
		
		if (!await this.tripRepository.exists(tripId)) {

			throw new NotFoundError(`Trip ${tripId} not found`);

		}
		
		return this.shapeRepository.getByTripId(tripId);

	}
}
