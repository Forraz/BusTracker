import { ApiService, HTTPMethod } from "../api";
import { ShapeResponseSchema, type Shape } from "../schema";

const shapeService  = {

	resource: 'shapes',

	async getById(id: string): Promise<Shape | null> {

		const data = await ApiService.request(HTTPMethod.GET, `${this.resource}/${id}/`);
		const parsedData = ShapeResponseSchema.parse(data).shape;

		return parsedData;

	},

}

export default shapeService;
