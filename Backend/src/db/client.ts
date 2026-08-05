import 'dotenv/config';
import { Pool } from "pg";
import { drizzle, NodePgDatabase } from "drizzle-orm/node-postgres";


export class Database {

	public readonly pool: Pool
	public readonly db: NodePgDatabase

	constructor(connectionString: string = "") {

		if (connectionString === "") {

			connectionString = process.env.DATABASE_URL ?? "";

		}

		this.pool = new Pool({

			connectionString: connectionString

		});

		this.db = drizzle({ client: this.pool });

	}

}

