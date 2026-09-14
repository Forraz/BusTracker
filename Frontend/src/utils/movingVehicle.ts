import { along, nearestPointOnLine, lineString, distance} from "@turf/turf";

import type { Vehicle, Shape, Coordinates } from "../api/schema.ts";
import { SmoothDistanceTraveled } from "./smoothDistanceTraveled.ts"; 

export class MovingVehicle {

	data: Vehicle;
	shapeLine;
	distanceTraveled: SmoothDistanceTraveled;
	lastCorrectionTime: number;

	constructor(vehicle: Vehicle, shape: Shape) {

		this.data = vehicle;
		this.shapeLine = lineString(shape.parts.map((part) => [part.coordinates.lon, part.coordinates.lat]));

		const initialDistanceTraveled = this.getDistanceTraveledByPos(vehicle.coordinates);
		this.distanceTraveled = new SmoothDistanceTraveled(initialDistanceTraveled, 60 / 3.6);
		this.lastCorrectionTime = Date.now();

	}	

	getPosition(): Coordinates {

		const point = along(this.shapeLine, this.distanceTraveled.getValue(), { units: "meters" });

		return { lat: point.geometry.coordinates[1]!, lon: point.geometry.coordinates[0]! }

	}

	getDistanceTraveledByPos(position: Coordinates) {

		const point = [ position.lon, position.lat ];

		return nearestPointOnLine(this.shapeLine, point, { units: "meters" }).properties.totalDistance;

	}

	update(deltaTime: number) {

		this.distanceTraveled.update(deltaTime);

	}

	correct(vehicle: Vehicle) {

		const now = Date.now();

		const correctDistanceTraveled = this.getDistanceTraveledByPos(vehicle.coordinates);
		const deltaTime = (now - this.lastCorrectionTime) / 1000;
		this.lastCorrectionTime = now;
		
		this.distanceTraveled.correct(correctDistanceTraveled, deltaTime);

	}

}
