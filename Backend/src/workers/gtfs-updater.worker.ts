import { Worker } from "../core/worker.js";
import type { GTFSUpdater } from "../gtfs/gtfs.updater.js";


export class GTFSUpdateWorker extends Worker {

	private timers: NodeJS.Timeout[] = [];

	constructor(

		private updater: GTFSUpdater

	) {

		super();

	}

	public async start() {

		await this.updater.init();

		this.updater.updateRtData();
		this.timers.push(setInterval(() => {

			this.updater.updateRtData();

		}, 5 * 1000));

		this.updater.updateStaticData();
		this.timers.push(setInterval(() => {

			this.updater.updateStaticData();

		}, 60 * 60 * 1000));

	}

	public stop() {

		this.timers.forEach(t => clearInterval(t));

	}

}
