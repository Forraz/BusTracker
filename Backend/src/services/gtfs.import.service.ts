import { from } from "pg-copy-streams"
import { createReadStream } from "node:fs";
import { pipeline } from "node:stream/promises";
import type { PgTable } from "drizzle-orm/pg-core";

import { Service } from "../core/service.js"; 
import { pool } from "../db/client.js";
import { getTableName } from "drizzle-orm";

export class GTFSImportService extends Service {

	public async loadDataToTable(csvPath: string, table: PgTable) {

		const client = await pool.connect();

		try {

			const tableName = getTableName(table);
			const newTableName = `${tableName}_new`;  
			
			await client.query("BEGIN;");

			await client.query(`CREATE TABLE ${newTableName} AS SELECT * FROM ${tableName} WHERE false;`);

			const ingestStream = client.query(from(`COPY ${newTableName} FROM STDIN DELIMITER ',' CSV HEADER;`));
			const sourceStream = createReadStream(csvPath);
			await pipeline(sourceStream, ingestStream);

			await client.query(`ALTER TABLE ${tableName} RENAME TO ${tableName}_tmp;`);
			await client.query(`ALTER TABLE ${newTableName} RENAME TO ${tableName};`);

			await client.query(`DROP TABLE ${tableName}_tmp;`);

			await client.query("COMMIT;");

		} catch (e) {

			await client.query("ROLLBACK;")
			console.log(e);

		} finally {

			client.release();

		}

	}

}
