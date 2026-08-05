import { StartedPostgreSqlContainer } from "@testcontainers/postgresql";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { Database } from "../../src/db/client.js";
import { App } from "../../src/app.js";
import { setupTestDB } from "../setup/db.js";
import { createGTFSRtProviderMock } from "../setup/rt-fixtures.js";

describe("Shape domain endpoints", () => {

	let app: App;
	let postgresContainer: StartedPostgreSqlContainer;
	let database: Database;

	beforeAll(async () => {
		
		[database, postgresContainer] = await setupTestDB();
		const gtfsRtMock = createGTFSRtProviderMock();

		app = new App(database, gtfsRtMock);

	});

	afterAll(async () => {

		postgresContainer.stop();

	});

	describe("GET /shape/:id/", async () => {

		it("returns shape", async () => {
		
			const response = await request(app.app)
				.get("/api/shapes/SHAPE_1")
				.expect(200);

			expect(response.body).toHaveProperty("shape");
			expect(response.body.shape).toMatchObject({

				id: "SHAPE_1",
				parts: [
					{
						coordinates: {
							lat: 52.0907,
							lon: 5.1214,
						},
						distTraveled: 0
					},
					{
						coordinates: {
							lat: 52.0910,
							lon: 5.1220,
						},
						distTraveled: 100
					},
				]

			});

		});

		it("returns 404 for non existent resource", async () => {
		
			const response = await request(app.app)
				.get("/api/shapes/DOES_NOT_EXIST")
				.expect(404);

		});

		it("returns 400 for invalid id", async () => {
		
			const response = await request(app.app)
				.get("/api/shapes/^%%^^#@$&^@#$")
				.expect(400);

		});
	

	})


});
