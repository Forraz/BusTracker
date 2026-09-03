import * as z from "zod";

export const CoordinatesSchema = z.object({

	lat: z.float32(),
	lon: z.float32(), 

});

const StopSchema = z.object({

	id: z.string(),
	name: z.string(),
	coordinates: CoordinatesSchema

});

export const StopResponseSchema = z.object({

	stop: StopSchema

});

export const StopsResponseSchema = z.object({

	stops: z.array(StopSchema)

});

const TripSchema = z.object({

	id: z.string(),
	routeId: z.string(),
	serviceId: z.string(),
	directionId: z.int(),
	shapeId: z.string()

});

export const TripResponseSchema = z.object({

	trip: TripSchema
		
});

export const TripsResponseSchema = z.object({

	trips: z.array(TripSchema)

});


const RouteSchema = z.object({

	id: z.string(),
	name: z.string()

});

export const RouteResponseSchema = z.object({

	route: RouteSchema

});

export const RoutesResponseSchema = z.object({

	routes: z.array(RouteSchema)

});

const ShapeSchema = z.object({

	id: z.string(), 
	parts: z.array(
		z.object({

			coordinates: CoordinatesSchema,
			distTraveled: z.int()

		})
	)

});

export const ShapeResponseSchema = z.object({

	shape: ShapeSchema,
	
});

export const ShapesResponseSchema = z.object({

	shapes: z.array(ShapeSchema)

});

const VehicleSchema = z.object({

	tripId: z.string(),
	routeId: z.string(),
	coordinates: CoordinatesSchema 

});

export const VehicleResponseSchema = z.object({

	vehicle: VehicleSchema
		
});

export const VehiclesResponseSchema = z.object({

	vehicles: z.array(VehicleSchema)
		
});

export type Coordinates = z.infer<typeof CoordinatesSchema>;
export type Stop = z.infer<typeof StopSchema>;
export type Trip = z.infer<typeof TripSchema>;
export type Route = z.infer<typeof RouteSchema>;
export type Shape = z.infer<typeof ShapeSchema>;
export type Vehicle = z.infer<typeof VehicleSchema>;

function validate(schema: z.ZodObject, data: {}) {

	let parsedData = null;

	try {

		parsedData = schema.parse(data);

	} catch (e) {

		console.log(e);

	}

	return parsedData;

} 
