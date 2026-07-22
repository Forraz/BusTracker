import { Router } from "express";
import { ShapeController } from "../controllers/shape.controller.js";


export const shapeRouter = Router();
const shapeController: ShapeController = ShapeController.instance;

shapeRouter.get("/:id", shapeController.handleGetShapeById.bind(shapeController));
