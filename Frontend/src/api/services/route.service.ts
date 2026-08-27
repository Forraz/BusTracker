import { ApiService, HTTPMethod } from "../api";
import { RouteResponseSchema, StopsResponseSchema, VehiclesResponseSchema, type Route, type Stop, type Vehicle } from "../schema";

const routeService  = {

	resource: 'routes',

	async getById(id: string): Promise<Route | null> {

		const data = await ApiService.request(HTTPMethod.GET, `${this.resource}/${id}/`);
		const parsedData = RouteResponseSchema.parse(data).route;

		return parsedData;

	},

	async getStopsById(id: string): Promise<Stop[] | null> {

		const data = await ApiService.request(HTTPMethod.GET, `${this.resource}/${id}/stops`);
		const parsedData = StopsResponseSchema.parse(data).stops;

		return parsedData;

	},

	async getVehiclesById(id: string): Promise<Vehicle[] | null> {

		const data = await ApiService.request(HTTPMethod.GET, `${this.resource}/${id}/vehicles`);
		const parsedData = VehiclesResponseSchema.parse(data).vehicles;

		return parsedData;

	},
}

export default routeService;
