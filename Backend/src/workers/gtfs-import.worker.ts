import type EventEmitter from "events";
import { Worker } from "../core/worker.js"

import { EventName, type Entity } from "../services/gtfs-api.service.js";
import { GTFSImportService } from "../services/gtfs-import.service.js";

export class GTFSImportWorker extends Worker {

	constructor(

		private importService: GTFSImportService,
		private eventEmitter: EventEmitter

	) {

		super();

	}

	public start() {

		this.eventEmitter.addListener(EventName.EntityUpdated, this.onEntityUpdated);

	}

	public stop() {

		this.eventEmitter.removeListener(EventName.EntityUpdated, this.onEntityUpdated);

	}

	
	private onEntityUpdated(event: { entity: Entity }) {

		if (event.entity.type == "static") {

			this.importService.updateData(event.entity.fileName);

		}

	}

}
