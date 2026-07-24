import type { Tspec } from "tspec";
import type { StopDTO } from "../dto/stop.dto.js";
import type { VehicleDTO } from "../dto/vehicle.dto.js";
import type { RouteDTO } from "../dto/route.dto.js";

interface RouteSpec {
	tags: [ "Route" ],
	paths: {
		"/routes": {
			get: {
				summary: "Find Routes by name",
				query: {
					name: string,
					limit?: number
				},
				responses: {
					200: RouteDTO[]
				}
			}
		}, 
		"/routes/{id}": {
			get: {
				summary: "Get Route by id",
				path: { id: number },
				responses: {
					200: RouteDTO
				}
			}
		}, 
		"/routes/{id}/stops": {
			get: {
				summary: "Get Stops by Route id",
				path: { id: number },
				responses: {
					200: StopDTO[]
				}
			}
		},
		"/routes/{id}/vehicles": {
			get: {
				summary: "Get Vehicles by Route id",
				path: { id: number },
				responses: {
					200: VehicleDTO[]
				}
			}
		},
	}
}

export type RouteApiSpec = Tspec.DefineApiSpec<RouteSpec>;
