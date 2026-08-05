import type { GTFSRtProvider } from "../../src/gtfs/gtfs-rt.store.js";
import { type TripUpdate, type VehiclePosition } from "../../src/types/gtfs.js";


const vehiclePositions: VehiclePosition[] = [
	{
		trip: {
			tripId: "TRIP_1",
			routeId: "ROUTE_1",
			directionId: 0,
			startTime: "08:00:00",
			startDate: "20260730"
		},
		position: {
			latitude: 52.0907,
			longitude: 5.1214,
			bearing: 90,
			speed: 12
		},
		currentStopSequence: 1,
		stopId: "STOP_A",
		timestamp: 1753891200
	},
	{
		trip: {
			tripId: "TRIP_2",
			routeId: "ROUTE_2",
			directionId: 0,
			startTime: "09:00:00",
			startDate: "20260730"
		},
		position: {
			latitude: 52.1,
			longitude: 5.2,
			bearing: 270,
			speed: 8
		},
		currentStopSequence: 1,
		stopId: "STOP_A",
		timestamp: 1753891200
	}
];

export function createGTFSRtProviderMock(): GTFSRtProvider {

	const gtfsRtProviderMock: GTFSRtProvider = {

		getVehiclePositions(): VehiclePosition[] {

			return vehiclePositions;
			
		},
		getTripUpdates(): TripUpdate[] {
			
			return []

		},
		updateVehiclePositions(): void {},
		updateTripUpdates(): void {}
		

	}

	return gtfsRtProviderMock;

}
