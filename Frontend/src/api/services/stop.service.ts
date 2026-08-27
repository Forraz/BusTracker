import { ApiService, HTTPMethod } from "../api";

const stopService  = {

	resource: 'stops',

	async query(params: URLSearchParams) {

		const data = await ApiService.request(HTTPMethod.GET, `${this.resource}?${params.toString()}`);
		return data;

	},

	async getById(id: string) {

		const data = await ApiService.request(HTTPMethod.GET, `${this.resource}/${id}/`);
		return data;

	},

	async getRoutesById(id: string) {

		const data = await ApiService.request(HTTPMethod.GET, `${this.resource}/${id}/routes`);
		return data;

	}

}

export default stopService;
