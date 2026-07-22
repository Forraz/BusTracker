import { from } from "pg-copy-streams"
import { createReadStream } from "node:fs";
import { pipeline } from "node:stream/promises";
import { PgTable } from "drizzle-orm/pg-core";
import type { PoolClient } from "pg";

import { Service } from "../core/service.js"; 
import { getTableName } from "drizzle-orm";

import { pool } from "../db/client.js";
import { calendarDatesTable, routesTable, shapesTable, stopsTable, stopTimesTable, tripsTable } from "../db/schema.js";
import { EventName, GTFSApiService, type Entity } from "./gtfs-api.service.js";
import { unzip } from "../utils/unzip.js";
import { logger } from "../utils/logger.js";

export class GTFSImportService extends Service {

	protected constructor() {

		super();

		GTFSApiService.instance.events.on(EventName.EntityUpdated, (e: { entity: Entity }) => {

			if (e.entity.type == "static") {

				this.updateData(e.entity.fileName);

			}

		});
	}

	private async updateData(dataFileName: string) {

		await this.unzipData(dataFileName);
		await this.loadData();

	}

	private async unzipData(zipFileName: string) {

		const staticDataPath = `./${GTFSApiService.instance.STATIC_DATA_DIR}`;
		await unzip(`${staticDataPath}/${zipFileName}`, staticDataPath);

	}

	private async loadData() {

		const client: PoolClient =  await pool.connect();
		const tables: Array<PgTable> = [routesTable, shapesTable, tripsTable, stopsTable, stopTimesTable, calendarDatesTable];

		try {

			await client.query("BEGIN;");
			logger.info("Loading GTFS data into the database");

			await client.query(`TRUNCATE ${tables.map(t => getTableName(t)).join(', ')} RESTART IDENTITY CASCADE;`)

			for (const table of tables) {

				const staticDataPath = `./${GTFSApiService.instance.STATIC_DATA_DIR}`;
				const csvPath = `${staticDataPath}/${getTableName(table)}.txt`;
				await this.loadDataToTable(csvPath, table, client); 

			}

			await client.query("COMMIT;");
			logger.info("Finished loading GTFS data into the database");

		} catch (err) {

			await client.query("ROLLBACK;")
			logger.error({ err }, "GTFS data loading transaction failed");

		} finally {

			client.release();

		}


	}

	private async loadDataToTable(csvPath: string, table: PgTable, client: PoolClient) {

		const tableName = getTableName(table);

		const ingestStream = client.query(from(`COPY ${tableName} FROM STDIN DELIMITER ',' CSV HEADER;`));
		const sourceStream = createReadStream(csvPath);

		await pipeline(sourceStream, ingestStream);

	}

}
