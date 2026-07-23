import type { Tspec } from "tspec";
import type { StopDTO } from "../dto/stop.dto.js";
import type { RouteDTO } from "../dto/route.dto.js";

interface StopSpec {
	tags: [ "Stop" ],
	paths: {
		"/stops": {
			get: {
				summary: "Find stops by name",
				query: { query: string },
				responses: {
					200: StopDTO[]
				}
			}
		}, 
		"/stops/{id}": {
			get: {
				summary: "Get Stop by id",
				path: { id: number },
				responses: {
					200: StopDTO
				}
			}
		}, 
		"/stops/{id}/routes": {
			get: {
				summary: "Get Routes by Stop id",
				path: { id: number },
				responses: {
					200: RouteDTO[]
				}
			}
		}
	}
}

export type StopApiSpec = Tspec.DefineApiSpec<StopSpec>;
