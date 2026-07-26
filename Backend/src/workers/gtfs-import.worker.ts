import type EventEmitter from "events";
import { Worker } from "../core/worker.js"

import { EventName, type Entity } from "../gtfs/gtfs.updater.js";
import type { GTFSImporter } from "../gtfs/gtfs.importer.js";

export class GTFSImportWorker extends Worker {

	constructor(

		private importer: GTFSImporter,
		private eventEmitter: EventEmitter

	) {

		super();

	}

	public start() {

		this.eventEmitter.addListener(EventName.EntityUpdated, this.onEntityUpdated.bind(this));

	}

	public stop() {

		this.eventEmitter.removeListener(EventName.EntityUpdated, this.onEntityUpdated.bind(this));

	}

	
	private onEntityUpdated(event: { entity: Entity }) {

		if (event.entity.type == "static") {

			this.importer.updateData(event.entity.fileName);

		}

	}

}
