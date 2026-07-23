import type { Shape } from "../db/schema.js"
import type { Coordinates } from "../types/coordinates.js"

export type ShapeDTO = {

	id: string,
	parts: {
		coordinates: Coordinates,
		distTraveled: number
	}[]

}

export function mapShapeToDTO(shape: Shape[]): ShapeDTO {

	const shapeId = shape[0]?.id!;

	const shapeParts = shape.map((s) => {

		const part = {

			coordinates: {
				lat: s.shapePtLat!,
				lon: s.shapePtlon!
			},
			distTraveled: s.shapeDistTraveled!

		}

		return part;

	});

	const dto = {
		id: shapeId,
		parts: shapeParts
	}

	return dto;

}
