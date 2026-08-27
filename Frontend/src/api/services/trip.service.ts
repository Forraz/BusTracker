import { ApiService, HTTPMethod } from "../api";

const tripService  = {

	resource: 'trips',

	async getById(id: string) {

		const data = await ApiService.request(HTTPMethod.GET, `${this.resource}/${id}/`);
		return data;

	},

	async getVehicleById(id: string) {

		const data = await ApiService.request(HTTPMethod.GET, `${this.resource}/${id}/vehicle`);
		return data;

	},

	async getShapeById(id: string) {

		const data = await ApiService.request(HTTPMethod.GET, `${this.resource}/${id}/shape`);
		return data;

	},

	async getStopsById(id: string) {

		const data = await ApiService.request(HTTPMethod.GET, `${this.resource}/${id}/stops`);
		return data;

	}
}

export default tripService;
