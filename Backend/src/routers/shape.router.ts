import { Router } from "express";
import { ShapeController } from "../controllers/shape.controller.js";



export function createShapeRouter(shapeController: ShapeController) {

	const shapeRouter = Router();

	shapeRouter.get("/:id", shapeController.handleGetShapeById.bind(shapeController));

	return shapeRouter;

}
