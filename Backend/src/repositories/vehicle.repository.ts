import { Repository } from "../core/repository.js";
import { Database } from "../db/client.js";
import type { Trip } from "../db/schema.js";
import { type GTFSRtProvider } from "../gtfs/gtfs-rt.store.js";
import type { VehiclePosition } from "../types/gtfs.js";


export class VehicleRepository extends Repository {

	constructor(

		database: Database,
		private gtfsRtStore: GTFSRtProvider

	)  {

		super(database);

	}

	filterByTrips(trips: Trip[]): VehiclePosition[] {

		const vehiclePositions: VehiclePosition[] = this.gtfsRtStore.getVehiclePositions();

		const tripIds = trips.map((t) => t.id.toString());

		const filteredVehicles = vehiclePositions.filter((v) => {

			if (!v.trip || !v.trip.tripId) { return false; }
			
			return tripIds.includes(v.trip.tripId);

		});

		return filteredVehicles;

	}

	async getByTripId(id: string): Promise<VehiclePosition | null> {

		const vehiclePositions: VehiclePosition[] = this.gtfsRtStore.getVehiclePositions();

		const vehicle = vehiclePositions.find((v) => v.trip?.tripId === id);

		return vehicle ? vehicle : null;

	}


}
