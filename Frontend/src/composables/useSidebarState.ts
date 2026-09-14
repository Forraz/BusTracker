import stopService from "../api/services/stop.service.ts";
import routeService from "../api/services/route.service.ts";
import tripService from "../api/services/trip.service.ts";

import type { Stop, Route, Vehicle } from "../api/schema.ts";

import { MovingVehicle } from "../utils/movingVehicle.ts";

import { type MapState } from "./useMapState.ts";

import { ref, computed,  } from "vue";
import { LatLng } from "leaflet";


export class SidebarState {

	stops = ref<Stop[]>([]);
	routes = ref<Route[]>([]);
	vehicles = ref<Vehicle[]>([]);

	selectedStop = ref<Stop | null>(null);
	selectedRoute = ref<Route | null>(null);
	selectedVehicle = ref<Vehicle | null>(null);

	movingVehicle = ref<MovingVehicle | null>(null);

	map: MapState;

	constructor(map: MapState) {

		this.map = map;

	}

	async queryStops(name: string) {

		const data = await stopService.query(new URLSearchParams(`name=${name}&limit=20`)) || [];
		this.stops.value = data;

	}

	async fetchRoutesByStopId(stopId: string) {

		this.routes.value = [];

		const data = await stopService.getRoutesById(stopId) || [];
		this.routes.value = data;

	}

	async fetchVehiclesByRouteId(routeId: string) {

		this.vehicles.value = [];

		const data = await routeService.getVehiclesById(routeId) || [];
		this.vehicles.value = data;

	}

	resetStops() {

		this.stops.value = [];

	}

	resetRoutes() {

		this.routes.value = [];

	}

	resetVehicles() {

		this.vehicles.value = [];

	}

	async selectStop(stop: Stop) {

		this.selectedStop.value = stop;

		this.map.setPosition(new LatLng(stop.coordinates.lat, stop.coordinates.lon));
		this.map.setZoom(18);

		this.map.clearMarkers();
		this.map.addMarker({
			id: "currentStop",
			position: new LatLng(stop.coordinates.lat, stop.coordinates.lon)
		});

		await this.fetchRoutesByStopId(stop.id);

	}

	updateSelectedStop() {

		if (this.selectedStop.value) {

			this.selectStop(this.selectedStop.value);

		}

	}

	async selectRoute(route: Route) {

		this.selectedRoute.value = route;

		this.map.setZoom(11);

		this.map.clearMarkers();
		this.map.clearPolylines();

		this.vehicles.value.forEach((vehicle) => {

			this.map.addMarker({
				id: `vehicle${vehicle.tripId}`,
				position: new LatLng(
					vehicle.coordinates.lat,
					vehicle.coordinates.lon
				)
			});

		});

		await this.fetchVehiclesByRouteId(route.id);

	}

	updateSelectedRoute() {

		if (this.selectedRoute.value) {

			this.selectRoute(this.selectedRoute.value);

		}

	}

	async selectVehicle(vehicle: Vehicle) {

		const shape = await tripService.getShapeById(vehicle.tripId);
		const movingVehicle = new MovingVehicle(vehicle, shape);

		this.selectedVehicle.value = vehicle;
		this.movingVehicle.value = movingVehicle;

		this.map.setPosition(new LatLng(vehicle.coordinates.lat, vehicle.coordinates.lon));
		this.map.setZoom(18);

		this.map.clearMarkers();
		this.map.addMarker({
			id: "currentVehicle",
			position: computed(() => { 

				const vehiclePosition = this.movingVehicle.value.getPosition();

				return new LatLng(vehiclePosition.lat, vehiclePosition.lon) 

			})
		});

		const polylineParts: LatLng[] = shape!.parts.map((part) => new LatLng(part.coordinates.lat, part.coordinates.lon));

		this.map.clearPolylines();
		this.map.addPolyline({
			id: shape!.id,
			parts: polylineParts
		});

	}

	updateSelectedVehicle() {

		if (this.selectedVehicle.value) {

			this.selectVehicle(this.selectedVehicle.value);

		}

	}

	back() {

		const selectedStop = this.selectedStop.value;
		const selectedRoute = this.selectedRoute.value;
		const selectedVehicle = this.selectedVehicle.value;

		if (selectedVehicle) {

			this.selectedVehicle.value = null;
			this.updateSelectedRoute();

		} else if (selectedRoute) {

			this.selectedRoute.value = null;
			this.resetVehicles();
			this.updateSelectedStop();

		} else if (selectedStop) {

			this.selectedStop.value = null;
			this.resetRoutes();
			this.map.clearMarkers();

		}

	}

	updateMovingVehicle(deltaTime: number) {


		if (this.movingVehicle.value) {

			console.log(deltaTime);

			this.movingVehicle.value.update(deltaTime);

		}

	}

	async correctMovingVehicle() {

		if (this.movingVehicle.value && this.selectedVehicle.value) {

			 const vehicle = await tripService.getVehicleById(this.selectedVehicle.value.tripId);

			 if (vehicle.coordinates.lat != this.selectedVehicle.value.coordinates.lat) {

				this.selectedVehicle.value = vehicle;
				this.movingVehicle.value.correct(vehicle);

			}

		}

	}


}

export function useSidebarState(map: MapState) {

	const sidebarState = new SidebarState(map);

	return sidebarState;

}
