import { Controller } from "../core/controller.js";
import type { Request, Response, NextFunction } from "express";
import { ShapeService } from "../services/shape.service.js";
import type { Shape } from "../db/schema.js"; 
import { type ShapeDTO, mapShapeToDTO } from "../dto/shape.dto.js";
 
interface ShapeIdParams {

	id: string

}

export class ShapeController extends Controller {

	async handleGetShapeById(req: Request<ShapeIdParams>, res: Response, next: NextFunction) {

		const shapeService: ShapeService = ShapeService.instance;
		
		const shapeId = req.params.id;

		const results: Shape[] = await shapeService.getShapeById(shapeId);
		const shape: ShapeDTO = mapShapeToDTO(results);

		const responseData = {

			shape: shape

		}

		res.status(200).json(responseData);

	}


}
