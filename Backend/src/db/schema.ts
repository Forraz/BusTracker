import { pgTable, integer, real, text, time } from "drizzle-orm/pg-core";

export const shapesTable = pgTable("shapes", {

	id: text("id"),
	shapePtSequence: integer("shape_pt_sequence"),
	shapePtLat: real("shape_pt_lat"),
	shapePtlon: real("shape_pt_lon"),
	shapeDistTraveled: real("shape_dist_traveled")

});

export const routesTable = pgTable("routes", {

	id: text("id").primaryKey(),
	agencyId: text("agency_id"),
	routeShortName: text("route_short_name"),
	routeLongName: text("route_long_name"),
	routeDesc: text("route_desc"),
	routeType: text("route_type"),
	routeColor: text("route_color"),
	routeTextColor: text("route_text_color"),
	routeUrl: text("route_url")

});

export const tripsTable = pgTable("trips", {

	routeId: text("route_id"),
	serviceId: text("service_id"),
	id: text("id").primaryKey(),
	realtimeTripId: text("realtime_trip_id"),
	tripHeadsign: text("trip_headsign"),
	tripShortName: text("trip_short_name"),
	tripLongName: text("trip_long_name"),
	directionId: integer("direction_id"), 
	blockId: text("block_id"),
	shapeId: text("shape_id"),
	wheelchairAccessible: integer("wheelchair_accessible"),
	bikesAllowed: integer("bikes_allowed"),

});

export const stopsTable = pgTable("stops", {

	id: text("id").primaryKey(),
	stopCode: text("stop_code"),
	stopName: text("stop_name"),
	stopLat: real("stop_lat"),
	stopLon: real("stop_lon"),
	locationType: text("location_type"), 
	parentStation: text("parent_station"),
	stopTimezone: text("stop_timezone"),
	wheelchairBoarding: integer("wheelchair_boarding"),
	platformCode: text("platform_code"),
	zoneId: text("zone_id")

});

export const stopTimesTable = pgTable("stop_times", {

	tripId: text("trip_id"),
	stopSequence: integer("stop_sequence"),
	stopId: text("stop_id"),
	stopHeadsign: text("head_sign"),
	arrivalTime: text("arrival_time"),
	departureTime: text("departure_time"),
	pickupType: integer("pickup_time"),
	dropOffType: integer("drop_off_time"),
	timepoint: integer("timepoint"),
	shapeDistTraveled: integer("shape_dist_traveled"),
	fairUnitsTraveled: integer("fair_units_traveled")

});

export const calendarDatesTable = pgTable("calendar_dates", {

	id: text("id"),
	date: text("date"),
	exceptionType: integer("exception_type")

});

export type Stop = typeof stopsTable.$inferSelect;
export type Trip = typeof tripsTable.$inferSelect;
