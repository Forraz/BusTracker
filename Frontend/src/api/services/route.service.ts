import { ApiService, HTTPMethod } from "../api";

const routeService  = {

	resource: 'routes',

	async getById(id: string) {

		const data = await ApiService.request(HTTPMethod.GET, `${this.resource}/${id}/`);
		return data;

	},

	async getStopsById(id: string) {

		const data = await ApiService.request(HTTPMethod.GET, `${this.resource}/${id}/stops`);
		return data;

	},

	async getVehiclesById(id: string) {

		const data = await ApiService.request(HTTPMethod.GET, `${this.resource}/${id}/vehicles`);
		return data;

	},
}

export default routeService;
