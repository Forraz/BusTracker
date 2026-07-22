import { EventEmitter } from "node:events";
import { readFile } from "node:fs/promises";
import { writeFile, mkdir } from "node:fs/promises";

import { Service } from "../core/service.js";
import { logger } from "../utils/logger.js";

export interface Entity {
	url: string,
	fileName: string,
	fileDirPath: string,
	type: "static" | "rt"
	etag: string,
	isDownloading: boolean
}

export enum EventName {

	EntityUpdated = "entityUpdated"

}

export class GTFSApiService extends Service {

	private API_URL = "https://gtfs.ovapi.nl/nl";
	private DATA_DIR_PATH = "src/data"
	private INDEX_PATH = `${this.DATA_DIR_PATH}/index.json`;
	public RT_DATA_DIR = `${this.DATA_DIR_PATH}/rt-data`;
	public STATIC_DATA_DIR = `${this.DATA_DIR_PATH}/static-data`;

	private RT_SYNC_URLS: string[] = [

		`${this.API_URL}/vehiclePositions.pb`,
		`${this.API_URL}/tripUpdates.pb`,

	];

	private STATIC_SYNC_URLS: string[] = [

		`${this.API_URL}/gtfs-nl.zip`,

	];

	entities: Entity[] = [];
	events: EventEmitter = new EventEmitter();
	
	protected constructor() {

		super();

		this.init();

	}

	async init() {

		await this.initializeIndex();

		this.updateRtData();
		setInterval(() => {

			this.updateRtData();

		}, 5 * 1000);

		this.updateStaticData();
		setInterval(() => {

			this.updateStaticData();

		}, 60 * 60 * 1000);
	}

	async initializeIndex() {

		await this.initializeEntities(this.RT_SYNC_URLS, "rt");
		await this.initializeEntities(this.STATIC_SYNC_URLS, "static"); 
	}
	
	async initializeEntities(urls: string[], type: "static" | "rt") {

		await this.readEntities();
		urls.forEach(url => {

			const fileName = url.split("/").at(-1);

			if (fileName == null) {

				throw new Error(`Wrong sync url format: ${url}`);

			}

			let fileDirPath;
			
			if (type == "static") {

				fileDirPath = `./${this.STATIC_DATA_DIR}`;

			} else {

				fileDirPath = `./${this.RT_DATA_DIR}`;

			}

			const etag = "";

			const entity: Entity = {
				url: url,
				fileName: fileName,
				fileDirPath: fileDirPath,
				type: type,
				etag: etag,
				isDownloading: false
			};
		
			const existingEntity = this.entities.find(ent => ent.url == entity.url);

			if (!existingEntity) {

				this.entities.push(entity);

			} else {

				existingEntity.isDownloading = false;

			}
				
		});

		await this.updateIndex();

	}

	async updateRtData() {

		await this.readEntities();
		await this.syncRtEntities();

	}

	async updateStaticData() {

		await this.readEntities();
		await this.syncStaticEntities();

	}

	async syncRtEntities() {

		this.entities.filter((e) => e.type == "rt").forEach(entity => this.syncEntity(entity));

	}

	async syncStaticEntities() {

		this.entities.filter((e) => e.type == "static").forEach(entity => this.syncEntity(entity));

	}

	async syncEntity(entity: Entity) {

		let headers;
		let entityData;

		try {

			headers = await this.fetchEntityHeaders(entity.url);
		
		} catch (err) {

			logger.error({ entity: entity.url, ...{ err } }, "Failed to fetch entity headers");
			return;

		}

		const etag = headers.get("etag");

		if (entity.isDownloading || etag == entity.etag || !etag) return;

		try {

			entity.isDownloading = true;
			entity.etag = etag;
			this.updateEntity(entity);

			entityData = await this.fetchEntity(entity.url);

		} catch (err) {

			logger.error({ entity: entity.url, ...{ err } }, "Failed to fetch entity");

			entity.isDownloading = false;
			entity.etag = "";
			this.updateEntity(entity);

			return;

		}

		entity.isDownloading = false;
		this.updateEntity(entity);

		await this.writeEntity(entity, entityData);

		this.events.emit(EventName.EntityUpdated, { entity: entity });
		logger.info({ entity: entity.url }, "GTFS entity updated");

	}

	async updateEntity(entity: Entity) {

		this.entities[this.entities.findIndex(ent => ent.url == entity.url)] = entity;
		this.updateIndex();

	}

	async writeEntity(entity: Entity, data: Buffer) {

		await this.createDir(entity.fileDirPath);

		await writeFile(`${entity.fileDirPath}/${entity.fileName}`, data);

	}

	async createDir(path: string) {

		await mkdir(`./${path}`, { recursive: true });

	}

	async readEntities() {

		const filePath = `./${this.INDEX_PATH}`;
		this.entities = [];

		try {

			const data = await readFile(filePath);
			this.entities = JSON.parse(data.toString())["entities"];

		} catch (err) {

			this.entities = [];

		}

	}

	async updateIndex() {

		await this.createDir(this.DATA_DIR_PATH);

		const filePath = `./${this.INDEX_PATH}`;
		const entitiesJson = JSON.stringify({ "entities": this.entities });

		await writeFile(filePath, entitiesJson);

	}

	async fetchEntity(url: string): Promise<Buffer> {

		const response = await fetch(url);

		logger.debug({ entity: url }, "Fetching entity");

		if (!response.ok) {

			throw new Error(`${url} respond with ${response.status} status code`);

		}

		if (!response.body) {

			throw new Error(`${url} returned an empty response`);

		}

		const reader = response.body.getReader();

		let result = [];

		while (true) {

			const {done, value} = await reader.read();

			if (done) break;

			result.push(value);

		}

		return Buffer.concat(result);

	}

	async fetchEntityHeaders(url: string) {

		const response = await fetch(url, { method: "HEAD" });
		logger.debug({ entity: url }, "Fetching entity headers");

		if (!response.ok) {

			throw new Error(`${url} respond with ${response.status} status code`);

		}

		const result = response.headers;

		return result;

	}

}
