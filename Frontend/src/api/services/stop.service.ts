import { ApiService, HTTPMethod } from "../api";
import { RoutesResponseSchema, StopResponseSchema, StopsResponseSchema, type Route, type Stop } from "../schema";

const stopService  = {

	resource: 'stops',

	async query(params: URLSearchParams): Promise<Stop[] | null> {

		const data = await ApiService.request(HTTPMethod.GET, `${this.resource}?${params.toString()}`);
		const parsedData = StopsResponseSchema.parse(data).stops;

		return parsedData;

	},

	async getById(id: string): Promise<Stop | null> {

		const data = await ApiService.request(HTTPMethod.GET, `${this.resource}/${id}/`);
		const parsedData = StopResponseSchema.parse(data).stop;


		return parsedData;

	},

	async getRoutesById(id: string): Promise<Route[] | null> {

		const data = await ApiService.request(HTTPMethod.GET, `${this.resource}/${id}/routes`);
		const parsedData = RoutesResponseSchema.parse(data).routes;

		return parsedData;

	}

}

export default stopService;
