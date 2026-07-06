import { readFile } from "node:fs/promises";
import { Service } from "../core/service.js";
import type { TripUpdate, VehiclePosition } from "../types/gtfs.js";
import { transit_realtime } from "../gtfs/gtfs-rt.js";

export class GTFSRtService extends Service {

	private vehiclePositions: VehiclePosition[] = [];
	private tripUpdates: TripUpdate[] = [];

	protected constructor() {

		super();

		this.updateFeeds();

	}

	private async updateFeeds() {

		await this.updateVehiclePositions();
		await this.updateTripUpdates();

	}

	private async updateVehiclePositions() {

		const vehiclePositionsBuffer = await readFile("./src/data/rt-data/vehiclePositions.pb");
		const message = transit_realtime.FeedMessage.decode(vehiclePositionsBuffer);

		const vehicles: VehiclePosition[] = message.entity
			.map((e) => e.vehicle)
			.filter((v) => v != null) as VehiclePosition[];

		this.vehiclePositions = vehicles;

	}

	private async updateTripUpdates() {

		const tripUpdatesBuffer = await readFile("./src/data/rt-data/tripUpdates.pb");
		const message = transit_realtime.FeedMessage.decode(tripUpdatesBuffer);

		const tripUpdates: TripUpdate[] = message.entity
			.map((e) => e.tripUpdate)
			.filter((v) => v != null) as TripUpdate[];

		this.tripUpdates = tripUpdates;

	}

	public getVehiclePositions() {

		return this.vehiclePositions;

	}

	public getTripUpdates() {

		return this.tripUpdates;

	}

}
