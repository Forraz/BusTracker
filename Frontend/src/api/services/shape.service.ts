import { ApiService, HTTPMethod } from "../api";

const shapeService  = {

	resource: 'shapes',

	async getById(id: string) {

		const data = await ApiService.request(HTTPMethod.GET, `${this.resource}/${id}/`);
		return data;

	},

}

export default shapeService;
