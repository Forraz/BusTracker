import { Worker } from "../core/worker.js";
import type { GTFSApiService } from "../services/gtfs-api.service.js";


export class GTFSApiWorker extends Worker {

	private timers: NodeJS.Timeout[] = [];

	constructor(

		private apiService: GTFSApiService

	) {

		super();

	}

	public start() {

		this.timers.push(setInterval(() => {

			this.apiService.updateRtData();

		}, 5 * 1000));

		this.timers.push(setInterval(() => {

			this.apiService.updateStaticData();

		}, 60 * 60 * 1000));

	}

	public stop() {

		this.timers.forEach(t => clearInterval(t));

	}

}
