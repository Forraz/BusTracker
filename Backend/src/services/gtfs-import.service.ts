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

			logger.info("Loading GTFS data into the database");

			await client.query("BEGIN;");

			for (const table of tables) {
				
				const tableName = getTableName(table);
				const stagingTableName = `${tableName}_staging`;

				const csvPath = `${GTFSApiService.instance.STATIC_DATA_DIR}/${tableName}.txt`;

				await client.query(`
					DROP TABLE IF EXISTS ${stagingTableName};
					CREATE TABLE ${stagingTableName} (LIKE ${tableName} INCLUDING ALL);
				`);
				await this.loadDataToTable(csvPath, stagingTableName, client); 

			}

			await client.query("COMMIT;");

			await client.query("BEGIN;");

			for (const table of tables) {

				const tableName = getTableName(table);
				const stagingTableName = `${tableName}_staging`;
				const oldTableName = `${tableName}_old`;

				await client.query(`ALTER TABLE ${tableName} RENAME TO ${oldTableName}`);
				await client.query(`ALTER TABLE ${stagingTableName} RENAME TO ${tableName}`);

				await client.query(`DROP TABLE ${oldTableName}`);

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

	private async loadDataToTable(csvPath: string, table: string, client: PoolClient) {

		const ingestStream = client.query(from(`COPY ${table} FROM STDIN DELIMITER ',' CSV HEADER;`));
		const sourceStream = createReadStream(csvPath);

		await pipeline(sourceStream, ingestStream);

	}

}
