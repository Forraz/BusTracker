import type { Tspec } from "tspec";
import type { ShapeDTO } from "../dto/shape.dto.js";

interface ShapeSpec {
	tags: [ "Shape" ],
	paths: {
		"/shapes/{id}": {
			get: {
				summary: "Get shape by id",
				path: { id: number },
				responses: {
					200: ShapeDTO
				}
			}
		}
	}
}

export type ShapeApiSpec = Tspec.DefineApiSpec<ShapeSpec>;
