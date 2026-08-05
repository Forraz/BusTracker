import { describe, it, beforeAll, afterAll, expect } from "vitest";
import request from "supertest";
import { App } from "../../src/app.js";
import { StartedPostgreSqlContainer } from "@testcontainers/postgresql";
import { setupTestDB } from "../setup/db.js";
import type { Database } from "../../src/db/client.js";
import { createGTFSRtProviderMock } from "../setup/rt-fixtures.js";

describe("Stop domain endpoints", () => {

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

	describe("GET /stops/", () => {

		it.each([

			{ name: "a", amount: 3 },
			{ name: "Central", amount: 1 },
			{ name: "7*&%*&$%*&$%", amount: 0 }

		])('returns $amount stops by name $name', async ({ amount, name }) => {
		
			const response = await request(app.app)
				.get(`/api/stops?name=${name}`)
				.expect(200);

			expect(response.body).toHaveProperty("stops");
			expect(response.body.stops.length).toBe(amount);

		});

		it("follows limit correctly", async () => {

			const response = await request(app.app)
				.get(`/api/stops?name=a&limit=1`)
				.expect(200);

			expect(response.body.stops.length).toBe(1);

		});

	});

	describe("GET /stops/:id/", () => {

		it("returns stop", async () => {
		
			const response = await request(app.app)
				.get("/api/stops/STOP_A")
				.expect(200);

			expect(response.body).toMatchObject({
				stop: {
					id: "STOP_A",
					name: "Central Station",
					coordinates: {
						lat: 52.0907,
						lon: 5.1214
					}
				}
			});

		});

		it("returns 404 for non existent resource", async () => {
		
			const response = await request(app.app)
				.get("/api/stops/DOES_NOT_EXIST")
				.expect(404);

		});

		it("returns 400 for invalid id", async () => {
		
			const response = await request(app.app)
				.get("/api/stops/^%%^^#@$&^@#$")
				.expect(400);

		});

	});

	describe("GET /stops/:id/routes/", () => {

		it("returns routes", async () => {

			const response = await request(app.app)
				.get("/api/stops/STOP_A/routes")
				.expect(200);

			expect(response.body).toHaveProperty("routes");
			expect(response.body.routes.length).toBe(2);

		});

		it("returns 404 for non existent resource", async () => {
		
			const response = await request(app.app)
				.get("/api/stops/DOES_NOT_EXIST/routes")
				.expect(404);

		});

		it("returns 400 for invalid id", async () => {
		
			const response = await request(app.app)
				.get("/api/stops/^%%^^#@$&^@#$/routes")
				.expect(400);

		});


	});

});
