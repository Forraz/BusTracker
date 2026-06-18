import { Service } from "../core/Service.js";

export class GeocodingService extends Service {

	API_KEY = process.env.GEOCODING_API_KEY;
	API_URL = "https://api.geoapify.com/v1/geocode";

	async getGeoPositionByAddress(address: string) {

		if (this.API_KEY == null) {

			throw Error("Geoapify api key not found.");

		}

		const params = new URLSearchParams();
		params.append("api_key", this.API_KEY);
		params.append("text", address);

		const url = `${this.API_URL}/search?${params}`;

		try {

			const response = await fetch(url, {method: "GET"});

			if (!response.ok) {

				throw Error(`${response.status}`);

			}

			const data = await response.json();

			return data;

		} catch (error) {

			console.log(error);

		}

	}

}
