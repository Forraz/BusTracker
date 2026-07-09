import { readFile } from "node:fs/promises";
import { Service } from "../core/service.js";
import type { TripUpdate, VehiclePosition } from "../types/gtfs.js";
import { transit_realtime } from "../gtfs/gtfs-rt.js";
import { EventName, GTFSApiService } from "./gtfs-api.service.js";

export class GTFSRtService extends Service {

	private vehiclePositions: VehiclePosition[] = [];
	private tripUpdates: TripUpdate[] = [];

	protected constructor() {

		super();

		this.updateFeeds();
		GTFSApiService.instance.events.on(EventName.EntitiesUpdated, (e: { entityName: string }) => {

			this.updateFeeds();

		});

	}

	private async updateFeeds() {

		await this.updateVehiclePositions();
		await this.updateTripUpdates();

	}

	private async updateVehiclePositions() {

		let vehiclePositionsBuffer;

		try {

			vehiclePositionsBuffer = await readFile("./src/data/rt-data/vehiclePositions.pb");
			const message = transit_realtime.FeedMessage.decode(vehiclePositionsBuffer);

			const vehicles: VehiclePosition[] = message.entity
				.map((e) => e.vehicle)
				.filter((v) => v != null) as VehiclePosition[];

			this.vehiclePositions = vehicles;

		} catch (err) {

			console.warn("Failed to update vehicle positions: ", {
				error: err
			});

		}

	}

	private async updateTripUpdates() {

		let tripUpdatesBuffer;

		try {

			tripUpdatesBuffer = await readFile("./src/data/rt-data/tripUpdates.pb");
			const message = transit_realtime.FeedMessage.decode(tripUpdatesBuffer);

			const tripUpdates: TripUpdate[] = message.entity
				.map((e) => e.tripUpdate)
				.filter((v) => v != null) as TripUpdate[];

			this.tripUpdates = tripUpdates;

		} catch (err) {

			console.warn("Failed to update trip updates: ", {
				error: err
			});

		}

	}

	public getVehiclePositions() {

		return this.vehiclePositions;

	}

	public getTripUpdates() {

		return this.tripUpdates;

	}

}
