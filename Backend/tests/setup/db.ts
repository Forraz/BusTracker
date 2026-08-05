
import { PostgreSqlContainer, StartedPostgreSqlContainer } from "@testcontainers/postgresql";
import { Database } from "../../src/db/client.js";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { join } from "node:path";
import { loadFixtures } from "./fixtures.js";

export async function setupTestDB(): Promise<[Database, StartedPostgreSqlContainer]> {

	const postgresContainer = await new PostgreSqlContainer("postgres:latest").start();
	const database = new Database(postgresContainer.getConnectionUri());

	await migrate(database.db, {
		migrationsFolder: join(process.cwd(), "drizzle")
	})

	await loadFixtures(database);

	return [database, postgresContainer];

}
