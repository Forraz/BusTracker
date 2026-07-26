import type EventEmitter from "events";
import { Worker } from "../core/worker.js";
import { type Entity, EventName } from "../gtfs/gtfs.updater.js";
import { type GTFSRtProvider } from "../gtfs/gtfs-rt.store.js";


export class GTFSRtWorker extends Worker {

	constructor(

		private rtProvider: GTFSRtProvider,
		private eventEmitter: EventEmitter

	) {

		super();

	}
	
	public async start() {

		this.eventEmitter.addListener(EventName.EntityUpdated, this.onEntityUpdated.bind(this));

	}

	public async stop() {

		this.eventEmitter.removeListener(EventName.EntityUpdated, this.onEntityUpdated.bind(this));

	}

	private async onEntityUpdated(event: { entity: Entity }) {

		if (event.entity.type == "rt") {

			if (event.entity.fileName == "vehiclePositions.pb") {

				this.rtProvider.updateVehiclePositions();

			} else if (event.entity.fileName == "tripUpdates.pb") {

				this.rtProvider.updateTripUpdates();

			}

		}

	}

}
