import type { Tspec } from "tspec";
import type { StopDTO } from "../dto/stop.dto.js";
import type { TripDTO } from "../dto/trip.dto.js";
import type { VehicleDTO } from "../dto/vehicle.dto.js";
import type { ShapeDTO } from "../dto/shape.dto.js";

interface TripSpec {
	tags: [ "Trip" ],
	paths: {
		"/trips/{id}": {
			get: {
				summary: "Get Trip by id",
				path: { id: number },
				responses: {
					200: TripDTO
				}
			}
		}, 
		"/trips/{id}/vehicle": {
			get: {
				summary: "Get Vehicle by Trip id",
				path: { id: number },
				responses: {
					200: VehicleDTO
				}
			}
		},
		"/trips/{id}/shape": {
			get: {
				summary: "Get Shape by Trip id",
				path: { id: number },
				responses: {
					200: ShapeDTO
				}
			}
		},
		"/trips/{id}/stops": {
			get: {
				summary: "Get Stops by Trip id",
				path: { id: number },
				responses: {
					200: StopDTO[]
				}
			}
		}
	}
}

export type TripApiSpec = Tspec.DefineApiSpec<TripSpec>;
