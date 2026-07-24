import type EventEmitter from "events";
import { Worker } from "../core/worker.js";
import { EventName, type Entity } from "../services/gtfs-api.service.js";
import { GTFSRtService } from "../services/gtfs-rt.service.js";


export class GTFSRtWorker extends Worker {

	constructor(

		private rtService: GTFSRtService,
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

				this.rtService.updateVehiclePositions();

			} else if (event.entity.fileName == "tripUpdates.pb") {

				this.rtService.updateTripUpdates();

			}

		}

	}

}
