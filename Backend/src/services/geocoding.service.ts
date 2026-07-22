import { Service } from "../core/service.js";
import { type Coordinates } from "../types/coordinates.js";

export class GeocodingService extends Service {

	API_KEY = process.env.GEOCODING_API_KEY;
	API_URL = "https://api.geoapify.com/v1/geocode";

	public async getCoordinatesByAddress(address: string): Promise<Coordinates> {

		if (this.API_KEY == null) {

			throw new Error("Geoapify api key not found.");

		}

		const params = new URLSearchParams();
		params.append("api_key", this.API_KEY);
		params.append("text", address);
		params.append("country", "Netherlands");

		const url = `${this.API_URL}/search?${params}`;

		try {

			const response = await fetch(url, { method: "GET" });

			const jsonData: any = await response.json();
			const geoJsonData = jsonData.features[0].properties;

			const coordinates: Coordinates = {
				lat: geoJsonData.lat,
				lon: geoJsonData.lon,
			};

			return coordinates;

		} catch (err) {

			throw new Error("Geocoding api request failed");

		}

	}

}
