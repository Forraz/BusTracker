import type { Route } from "../db/schema.js";

export interface RouteDTO {

	id: string,
	name: string

}


export function mapRouteToDTO(route: Route): RouteDTO {

	if (route.routeLongName == null) {

		route.routeLongName = "Unnamed route";

	}

	const dto: RouteDTO = {

		id: route.id,
		name: route.routeLongName

	};


	return dto;
	
}


