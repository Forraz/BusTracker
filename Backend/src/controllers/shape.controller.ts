import type { Request, Response, NextFunction } from "express";

import { Controller } from "../core/controller.js";
import type { Shape } from "../db/schema.js"; 
import { type ShapeDTO, mapShapeToDTO } from "../dto/shape.dto.js";
import { ShapeService } from "../services/shape.service.js";
 

interface ShapeIdParams {

	id: string

}

export class ShapeController extends Controller {

	constructor(

		private readonly shapeService: ShapeService,

	) {

		super();

	}

	async handleGetShapeById(req: Request<ShapeIdParams>, res: Response, next: NextFunction) {

		const results: Shape[] = await this.shapeService.getShapeById(req.params.id);
		const shape: ShapeDTO = mapShapeToDTO(results);

		const responseData = {

			shape: shape

		}

		res.status(200).json(responseData);

	}

}
