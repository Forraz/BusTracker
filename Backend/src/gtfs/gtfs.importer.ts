import { from } from "pg-copy-streams"
import { createReadStream } from "node:fs";
import { pipeline } from "node:stream/promises";
import { PgTable } from "drizzle-orm/pg-core";
import { join } from "node:path";
import type { PoolClient } from "pg";
import { getTableName } from "drizzle-orm";

import { STATIC_DATA_DIR_PATH } from "../core/paths.js";

import { calendarDatesTable, routesTable, shapesTable, stopsTable, stopTimesTable, tripsTable } from "../db/schema.js";
import { unzip } from "../utils/unzip.js";
import { logger } from "../utils/logger.js";
import type { Database } from "../db/client.js";

export class GTFSImporter {

	constructor(

		private database: Database

	) {


	}

	public async updateData(dataFileName: string) {

		await this.unzipData(dataFileName);
		await this.loadData();

	}

	public async unzipData(zipFileName: string) {

		await unzip(join(STATIC_DATA_DIR_PATH, zipFileName), STATIC_DATA_DIR_PATH);

	}

	public async loadData() {

		const client: PoolClient =  await this.database.pool.connect();
		const tables: Array<PgTable> = [routesTable, shapesTable, tripsTable, stopsTable, stopTimesTable, calendarDatesTable];

		try {

			logger.info("Loading GTFS data into the database");

			await client.query("BEGIN;");

			for (const table of tables) {
				
				const tableName = getTableName(table);
				const stagingTableName = `${tableName}_staging`;

				const csvPath = join(STATIC_DATA_DIR_PATH, `${tableName}.txt`);

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
