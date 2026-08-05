import { StartedPostgreSqlContainer } from "@testcontainers/postgresql";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { Database } from "../../src/db/client.js";
import { App } from "../../src/app.js";
import { setupTestDB } from "../setup/db.js";
import { createGTFSRtProviderMock } from "../setup/rt-fixtures.js";

describe("Trip domain endpoints", () => {

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

	describe("GET /trips/:id/", async () => {

		it("returns trip", async () => {
		
			const response = await request(app.app)
				.get("/api/trips/TRIP_1")
				.expect(200);

			expect(response.body).toMatchObject({
				trip: {
					id: "TRIP_1",
					routeId: "ROUTE_1",
					serviceId: "SERVICE_1",
					directionId: 0,
					shapeId: "SHAPE_1"
				}

			});

		});

		it("returns 404 for non existent resourse", async () => {
		
			const response = await request(app.app)
				.get("/api/trips/DOES_NOT_EXIST")
				.expect(404);

		});

		it("returns 400 for invalid id", async () => {
		
			const response = await request(app.app)
				.get("/api/trips/^%%^^#@$&^@#$")
				.expect(400);

		});
	

	});

	describe("GET /trips/:id/vehicle/", async () => {

		it("returns vehicle", async () => {
		
			const response = await request(app.app)
				.get("/api/trips/TRIP_1/vehicle")
				.expect(200);

			expect(response.body).toMatchObject({

				vehicle: {
					tripId: "TRIP_1",
					routeId: "ROUTE_1",
					position: {
						lat: 52.0907,
						lon: 5.1214,
					}
				}

			});

		});

		it("returns 404 when trip has no vehicle present", async () => {
		
			const response = await request(app.app)
				.get("/api/trips/TRIP_3/vehicle")
				.expect(404);

		});

		it("returns 404 for non existent resource", async () => {
		
			const response = await request(app.app)
				.get("/api/trips/DOES_NOT_EXIST/vehicle")
				.expect(404);

		});

		it("returns 400 for invalid id", async () => {
		
			const response = await request(app.app)
				.get("/api/trips/^%%^^#@$&^@#$/vehicle")
				.expect(400);

		});

	});

	describe("GET /trips/:id/shape/", async () => {

		it("returns shape", async () => {
		
			const response = await request(app.app)
				.get("/api/trips/TRIP_1/shape")
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

		it("returns 404 when trip has no shape", async () => {
		
			const response = await request(app.app)
				.get("/api/trips/TRIP_3/shape")
				.expect(404);

		});

		it("returns 404 for non existent resource", async () => {
		
			const response = await request(app.app)
				.get("/api/trips/DOES_NOT_EXIST/shape")
				.expect(404);

		});

		it("returns 400 for invalid id", async () => {
		
			const response = await request(app.app)
				.get("/api/trips/^%%^^#@$&^@#$/shape")
				.expect(400);

		});

	});

	describe("GET /trips/:id/stops/", async () => {

		it("returns stops", async () => {

			const response = await request(app.app)
				.get("/api/trips/TRIP_1/stops")
				.expect(200);

			expect(response.body).toHaveProperty("stops");
			expect(response.body.stops.length).toBe(3);
	
		});

		it("returns an empty array when trip has no stops", async () => {
		
			const response = await request(app.app)
				.get("/api/trips/TRIP_3/stops")
				.expect(200);

			expect(response.body).toHaveProperty("stops");
			expect(response.body.stops).toStrictEqual([]);


		});

		it("returns 404 for non existent resource", async () => {
		
			const response = await request(app.app)
				.get("/api/trips/DOES_NOT_EXIST/stops")
				.expect(404);

		});

		it("returns 400 for invalid id", async () => {
		
			const response = await request(app.app)
				.get("/api/trips/^%%^^#@$&^@#$/stops")
				.expect(400);

		});

	});


});
