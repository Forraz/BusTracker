import { readFile } from "node:fs/promises";
import { Service } from "../core/service.js";
import type { TripUpdate, VehiclePosition } from "../types/gtfs.js";
import { transit_realtime } from "../gtfs/gtfs-rt.js";
import { logger } from "../utils/logger.js";
import { join } from "node:path";
import { RT_DATA_DIR_PATH } from "../core/paths.js";

export class GTFSRtService extends Service {

	private vehiclePositions: VehiclePosition[] = [];
	private tripUpdates: TripUpdate[] = [];

	public async updateVehiclePositions() {

		let vehiclePositionsBuffer;

		try {

			vehiclePositionsBuffer = await readFile(join(RT_DATA_DIR_PATH, "vehiclePositions.pb"));
			const message = transit_realtime.FeedMessage.decode(vehiclePositionsBuffer);

			const vehicles: VehiclePosition[] = message.entity
				.map((e) => e.vehicle)
				.filter((v) => v != null) as VehiclePosition[];

			this.vehiclePositions = vehicles;

		} catch (err: any) {

			if (err.code == "ENOENT") {

				logger.info("Trip updates entity is not available yet")

			} else {

				logger.error({ err }, "Failed to update trip updates");

			}

			this.vehiclePositions = [];

		}

	}

	public async updateTripUpdates() {

		let tripUpdatesBuffer;

		try {

			tripUpdatesBuffer = await readFile(join(RT_DATA_DIR_PATH, "tripUpdates.pb"));
			const message = transit_realtime.FeedMessage.decode(tripUpdatesBuffer);

			const tripUpdates: TripUpdate[] = message.entity
				.map((e) => e.tripUpdate)
				.filter((v) => v != null) as TripUpdate[];

			this.tripUpdates = tripUpdates;

		} catch (err: any) {

			if (err.code == "ENOENT") {

				logger.info("Vehicle positions entity is not available yet")

			} else {

				logger.error({ err }, "Failed to update vehicle positions");

			}

			this.tripUpdates = [];

		}

	}

	public getVehiclePositions() {

		return this.vehiclePositions;

	}

	public getTripUpdates() {

		return this.tripUpdates;

	}

}
