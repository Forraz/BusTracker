import type { Database } from "../../src/db/client.js";
import { calendarDatesTable, routesTable, shapesTable, stopsTable, stopTimesTable, tripsTable } from "../../src/db/schema.js";

export async function loadFixtures(database: Database) {

	const db = database.db;

	await db.insert(routesTable).values(routesFixture);
	await db.insert(stopsTable).values(stopsFixture);
	await db.insert(calendarDatesTable).values(calendarDatesFixture);
	await db.insert(tripsTable).values(tripsFixture);
	await db.insert(stopTimesTable).values(stopTimesFixture);
	await db.insert(shapesTable).values(shapesFixture);

}


export const shapesFixture = [
	{
		id: "SHAPE_1",
		shapePtSequence: 1,
		shapePtLat: 52.0907,
		shapePtlon: 5.1214,
		shapeDistTraveled: 0
	},
	{
		id: "SHAPE_1",
		shapePtSequence: 2,
		shapePtLat: 52.0910,
		shapePtlon: 5.1220,
		shapeDistTraveled: 100
	}
];


export const routesFixture = [
	{
		id: "ROUTE_1",
		agencyId: "AGENCY_1",
		routeShortName: "1",
		routeLongName: "Central Station - Airport",
		routeDesc: "Test route",
		routeType: "3",
		routeColor: "FF0000",
		routeTextColor: "FFFFFF",
		routeUrl: null
	},
	{
		id: "ROUTE_2",
		agencyId: "AGENCY_1",
		routeShortName: "2",
		routeLongName: "University - Station",
		routeDesc: "Second test route",
		routeType: "3",
		routeColor: "0000FF",
		routeTextColor: "FFFFFF",
		routeUrl: null
	}
];


export const stopsFixture = [
	{
		id: "STOP_A",
		stopCode: "1000",
		stopName: "Central Station",
		stopLat: 52.0907,
		stopLon: 5.1214,
		locationType: "0",
		parentStation: null,
		stopTimezone: "Europe/Amsterdam",
		wheelchairBoarding: 1,
		platformCode: "A",
		zoneId: "1"
	},
	{
		id: "STOP_B",
		stopCode: "1001",
		stopName: "City Hall",
		stopLat: 52.0915,
		stopLon: 5.1225,
		locationType: "0",
		parentStation: null,
		stopTimezone: "Europe/Amsterdam",
		wheelchairBoarding: 1,
		platformCode: "B",
		zoneId: "1"
	},
	{
		id: "STOP_C",
		stopCode: "1002",
		stopName: "Airport",
		stopLat: 52.1000,
		stopLon: 5.2000,
		locationType: "0",
		parentStation: null,
		stopTimezone: "Europe/Amsterdam",
		wheelchairBoarding: 1,
		platformCode: "C",
		zoneId: "2"
	}
];


export const tripsFixture = [
	{
		routeId: "ROUTE_1",
		serviceId: "SERVICE_1",
		id: "TRIP_1",
		realtimeTripId: "RT_TRIP_1",
		tripHeadsign: "Airport",
		tripShortName: "1A",
		tripLongName: "Central Station - Airport",
		directionId: 0,
		blockId: "BLOCK_1",
		shapeId: "SHAPE_1",
		wheelchairAccessible: 1,
		bikesAllowed: 1
	},
	{
		routeId: "ROUTE_2",
		serviceId: "SERVICE_1",
		id: "TRIP_2",
		realtimeTripId: "RT_TRIP_2",
		tripHeadsign: "University",
		tripShortName: "2A",
		tripLongName: "Station - University",
		directionId: 0,
		blockId: "BLOCK_2",
		shapeId: "SHAPE_1",
		wheelchairAccessible: 1,
		bikesAllowed: 1
	},
	{
		routeId: null,
		serviceId: null,
		id: "TRIP_3",
		realtimeTripId: "RT_TRIP_3",
		tripHeadsign: "Airport",
		tripShortName: "1A",
		tripLongName: "Central Station - Airport",
		directionId: 0,
		blockId: "BLOCK_1",
		shapeId: null,
		wheelchairAccessible: 1,
		bikesAllowed: 1
	},
];


export const stopTimesFixture = [
	{
		tripId: "TRIP_1",
		stopSequence: 1,
		stopId: "STOP_A",
		stopHeadsign: "Airport",
		arrivalTime: "08:00:00",
		departureTime: "08:00:30",
		pickupType: 0,
		dropOffType: 0,
		timepoint: 1,
		shapeDistTraveled: 0,
		fairUnitsTraveled: 0
	},
	{
		tripId: "TRIP_1",
		stopSequence: 2,
		stopId: "STOP_B",
		stopHeadsign: "Airport",
		arrivalTime: "08:10:00",
		departureTime: "08:10:30",
		pickupType: 0,
		dropOffType: 0,
		timepoint: 1,
		shapeDistTraveled: 100,
		fairUnitsTraveled: 10
	},
	{
		tripId: "TRIP_1",
		stopSequence: 3,
		stopId: "STOP_C",
		stopHeadsign: "Airport",
		arrivalTime: "08:30:00",
		departureTime: "08:30:30",
		pickupType: 0,
		dropOffType: 0,
		timepoint: 1,
		shapeDistTraveled: 1000,
		fairUnitsTraveled: 20
	},
	{
		tripId: "TRIP_2",
		stopSequence: 1,
		stopId: "STOP_A",
		stopHeadsign: "University",
		arrivalTime: "09:00:00",
		departureTime: "09:00:30",
		pickupType: 0,
		dropOffType: 0,
		timepoint: 1,
		shapeDistTraveled: 0,
		fairUnitsTraveled: 0
	}
];


export const calendarDatesFixture = [
	{
		id: "SERVICE_1",
		date: "20260730",
		exceptionType: 1
	},
	{
		id: "SERVICE_2",
		date: "20260731",
		exceptionType: 1
	}
];
