import axios from "axios";

const api = axios.create({
	baseURL: "http://localhost:3000/api/",
	timeout: 10000
});

export enum HTTPMethod {

	GET

}

export const ApiService = {

	async request(method: HTTPMethod, slug: string) {

		let data = null;

		try {

			switch (method) {

				case HTTPMethod.GET:

					const response = await api.get(slug);
					data = response.data;
					break;
			}

		} catch (e) {

			console.log(e);

		}

		return data;

	}

}
