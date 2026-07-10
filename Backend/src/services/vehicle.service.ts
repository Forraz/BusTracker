import { Service } from "../core/service.js";
import type { VehiclePosition } from "../types/gtfs.js";
import type { Trip } from "../db/schema.js";
import { GTFSRtService } from "./gtfs-rt.service.js";

export class VehicleService extends Service {

	filterVehiclesByTrips(trips: Trip[]): VehiclePosition[] {

		const gtfGTFSRtService: GTFSRtService = GTFSRtService.instance;
		const vehiclePositions: VehiclePosition[] = gtfGTFSRtService.getVehiclePositions();

		const tripIds = trips.map((t) => t.id.toString());

		const filteredVehicles = vehiclePositions.filter((v) => {

			if (!v.trip || !v.trip.tripId) { return false; }
			
			return tripIds.includes(v.trip.tripId);

		});

		return filteredVehicles;

	}

	getVehicleByTripId(id: string): VehiclePosition | undefined {

		const gtfGTFSRtService: GTFSRtService = GTFSRtService.instance;
		const vehiclePositions: VehiclePosition[] = gtfGTFSRtService.getVehiclePositions();

		return vehiclePositions.find((v) => v.trip?.tripId === id);

	}


}
