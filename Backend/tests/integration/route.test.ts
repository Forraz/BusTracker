import { StartedPostgreSqlContainer } from "@testcontainers/postgresql";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { Database } from "../../src/db/client.js";
import { App } from "../../src/app.js";
import { setupTestDB } from "../setup/db.js";
import { createGTFSRtProviderMock } from "../setup/rt-fixtures.js";

describe("Route domain endpoints", () => {

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

	describe("GET /routes/", async () => {

		it.each([

			{ name: "a", amount: 3 },
			{ name: "Central", amount: 1 },
			{ name: "7*&%*&$%*&$%", amount: 0 }

		])('returns $amount routes by name $name', async ({ amount, name }) => {
		
			const response = await request(app.app)
				.get(`/api/routes?name=${name}`)
				.expect(200);

			expect(response.body).toHaveProperty("routes");
			expect(response.body.routes.length).toBe(amount);

		});

		it("follows limit correctly", async () => {

			const response = await request(app.app)
				.get(`/api/routes?name=a&limit=1`)
				.expect(200);

			expect(response.body.routes.length).toBe(1);

		});
	});

	describe("GET /routes/:id/", async () => {

		it("returns route", async () => {
		
			const response = await request(app.app)
				.get("/api/routes/ROUTE_1")
				.expect(200);

			expect(response.body).toHaveProperty("route");
			expect(response.body.route).toEqual({

				id: "ROUTE_1",
				name: "Central Station - Airport"

			});

		});

		it("returns 404 for non existent resource", async () => {
		
			const response = await request(app.app)
				.get("/api/routes/DOES_NOT_EXIST")
				.expect(404);

		});

		it("returns 400 for invalid id", async () => {
		
			const response = await request(app.app)
				.get("/api/routes/^%%^^#@$&^@#$")
				.expect(400);

		});

	});
	
	describe("GET /routes/:id/stops/", async () => {

		it("returns stops", async () => {
		
			const response = await request(app.app)
				.get("/api/routes/ROUTE_1/stops")
				.expect(200);

			expect(response.body).toHaveProperty("stops");
			expect(response.body.stops.length).toEqual(3);

		});

		it("returns 404 for non existent resource", async () => {
		
			const response = await request(app.app)
				.get("/api/routes/DOES_NOT_EXIST/stops")
				.expect(404);

		});

		it("returns 400 for invalid id", async () => {
		
			const response = await request(app.app)
				.get("/api/routes/^%%^^#@$&^@#$/stops")
				.expect(400);

		});

	});

	describe("GET /routes/:id/vehicles/", async () => {

		it("returns vehicles", async () => {
		
			const response = await request(app.app)
				.get("/api/routes/ROUTE_1/vehicles")
				.expect(200);

			expect(response.body).toHaveProperty("vehicles");
			expect(response.body.vehicles.length).toEqual(1);

		});

		it("returns 404 for non existent resource", async () => {
		
			const response = await request(app.app)
				.get("/api/routes/DOES_NOT_EXIST/vehicles")
				.expect(404);

		});

		it("returns 400 for invalid id", async () => {
		
			const response = await request(app.app)
				.get("/api/routes/^%%^^#@$&^@#$/vehicles")
				.expect(400);

		});

	});



});
