import { from } from "pg-copy-streams"
import { createReadStream } from "node:fs";
import { pipeline } from "node:stream/promises";
import { PgTable } from "drizzle-orm/pg-core";
import type { PoolClient } from "pg";

import { Service } from "../core/service.js"; 
import { getTableName } from "drizzle-orm";

import { pool } from "../db/client.js";
import { calendarDatesTable, routesTable, shapesTable, stopsTable, stopTimesTable, tripsTable } from "../db/schema.js";

export class GTFSImportService extends Service {

	public async loadData() {

		const client: PoolClient =  await pool.connect();
		const tables: Array<PgTable> = [routesTable, shapesTable, tripsTable, stopsTable, stopTimesTable, calendarDatesTable];

		try {

			await client.query("BEGIN;");

			await client.query(`TRUNCATE ${tables.map(t => getTableName(t)).join(', ')} RESTART IDENTITY CASCADE;`)

			for (const table of tables) {

				const csvPath = `./src/data/static-data/${getTableName(table)}.txt`;
				await this.loadDataToTable(csvPath, table, client); 

			}

			await client.query("COMMIT;");

		} catch (e) {

			await client.query("ROLLBACK;")
			console.log(e);

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
