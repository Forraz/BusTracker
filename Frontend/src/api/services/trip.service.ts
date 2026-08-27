import { ApiService, HTTPMethod } from "../api";
import { ShapeResponseSchema, StopsResponseSchema, TripResponseSchema, VehicleResponseSchema, type Shape, type Stop, type Trip, type Vehicle } from "../schema";

const tripService  = {

	resource: 'trips',

	async getById(id: string): Promise<Trip | null> {

		const data = await ApiService.request(HTTPMethod.GET, `${this.resource}/${id}/`);
		const parsedData = TripResponseSchema.parse(data).trip;

		return parsedData;

	},

	async getVehicleById(id: string): Promise<Vehicle | null> {

		const data = await ApiService.request(HTTPMethod.GET, `${this.resource}/${id}/vehicle`);
		const parsedData = VehicleResponseSchema.parse(data).vehicle;

		return parsedData;

	},

	async getShapeById(id: string): Promise<Shape | null> {

		const data = await ApiService.request(HTTPMethod.GET, `${this.resource}/${id}/shape`);
		const parsedData = ShapeResponseSchema.parse(data).shape;

		return parsedData;

	},

	async getStopsById(id: string): Promise<Stop[] | null> {

		const data = await ApiService.request(HTTPMethod.GET, `${this.resource}/${id}/stops`);
		const parsedData = StopsResponseSchema.parse(data).stops;

		return parsedData;

	}
}

export default tripService;
