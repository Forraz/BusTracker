import { readFile } from "node:fs/promises";
import { writeFile, mkdir } from "node:fs/promises";

interface Entity {
	url: string,
	filePath: string,
	etag: string,
	isDownloading: boolean
}

export class OVApiDataUpdater {

	API_URL = "gtfs.ovapi.nl/nl";
	ENTITES_FILE_NAME = "index.json";
	RT_DATA_DIR = "data/rt-data";

	entities: Entity[] = [];
	
	constructor(syncUrls: string[]) {

		this.initializeEntities(syncUrls);

		setInterval(() => {

			this.updateRtData();

		}, 5000);

	} 
	
	async initializeEntities(syncUrls: string[]) {

		await this.readEntities();
		syncUrls.forEach(url => {

			const fileName = url.split("/").at(-1);
			const filePath = `${this.RT_DATA_DIR}/${fileName}`;
			const etag = "";

			const entity: Entity = {
				url: url,
				filePath: filePath,
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

		await this.updateEntities();

	}

	async updateRtData() {

		await this.readEntities();
		await this.syncEntities();

	}

	async syncEntities() {

		this.entities.forEach(entity => this.syncEntity(entity));

	}

	async syncEntity(entity: Entity) {

		console.log(`Syncing: ${entity.url} `)

		let headers;
		let response;

		try {

			headers = await this.fetchEntityHeaders(entity.url);
		
		} catch (err) {

			console.error(err);
			return;

		}

		const etag = headers.get("etag");

		if (entity.isDownloading || etag == entity.etag || !etag) return;

		try {

			entity.isDownloading = true;

			this.entities[this.entities.findIndex(ent => ent.url == entity.url)] = entity;
			this.updateEntities();

			response = await this.fetchEntity(entity.url);

			entity.isDownloading = false;

		} catch (err){

			console.error(err);
			return;

		}
		
		entity.etag = etag;
		this.entities[this.entities.findIndex(ent => ent.url == entity.url)] = entity;
		this.updateEntities();

		await this.writeEntity(entity.filePath, response);

	}

	async writeEntity(filePath: string, data: Buffer) {

		await this.createDir(this.RT_DATA_DIR);

		await writeFile(filePath, data);

	}

	async createDir(path: string) {

		await mkdir(`./${path}`, { recursive: true });

	}

	async readEntities() {

		const filePath = `./${this.RT_DATA_DIR}/${this.ENTITES_FILE_NAME}`;
		this.entities = [];

		try {

			const data = await readFile(filePath);
			this.entities = JSON.parse(data.toString())["entities"];

		} catch (err) {

			console.error(err);

		}

	}

	async updateEntities() {

		await this.createDir(this.RT_DATA_DIR);

		const filePath = `./${this.RT_DATA_DIR}/${this.ENTITES_FILE_NAME}`;
		const entitiesJson = JSON.stringify({ "entities": this.entities });

		await writeFile(filePath, entitiesJson);

	}

	async fetchEntity(url: string): Promise<Buffer> {

		console.log(`Fetching: ${url}`);

		const response = await fetch(url);

		if (!response.ok) {

			throw new Error(`Response code: ${response.status}`);

		}

		if (!response.body) {

			throw new Error("Empty response");

		}

		const reader = response.body.getReader();

		let result = [];

		while (true) {

			const {done, value} = await reader.read();

			if (done) break;

			result.push(value);

		}

		console.log(`Done: ${url}`);

		return Buffer.concat(result);

	}

	async fetchEntityHeaders(url: string) {

		console.log(`Fetching headers: ${url}`);

		const response = await fetch(url, { method: "HEAD" });

		if (!response.ok) {

			throw new Error(`Response code: ${response.status}`);

		}

		const result = response.headers;

		return result;

	}

}
