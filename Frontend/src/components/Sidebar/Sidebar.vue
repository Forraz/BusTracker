<script setup lang="ts">

	import stopService from "../../api/services/stop.service.ts";
	import routeService from "../../api/services/route.service.ts";
	import tripService from "../../api/services/trip.service.ts";
	
	import { type Coordinates } from "../../api/schema.ts";
	import { MovingVehicle } from "../../utils/movingVehicle.ts";

	import { along, nearestPointOnLine, lineString } from "@turf/turf";

	import SearchBar from "./SearchBar.vue";
	import SearchResultList from "./SearchResultList.vue";
	import SelectedResultCard from "./SelectedResultCard.vue";

	import { useMap } from "../../composables/useMap.ts";
	import { type Marker, type Polyline } from "../../composables/useMapState.ts";

	import { ref, computed, onMounted } from "vue";
	import { IonIcon } from "@ionic/vue";
	import { swapHorizontal, layers, bus, arrowBack } from "ionicons/icons";
	import { LatLng } from "leaflet";

	let searchInput = ref("");

	let stops = ref([]);
	let routes = ref([]);
	let vehicles = ref([]);

	let currentStop = ref(null);
	let currentRoute = ref(null);

	let currentVehicle = ref(null);
	let movingVehicle = ref(null);

	const map = useMap();

	async function searchStops(stopName) {

		const data = await stopService.query(`name=${stopName}&limit=20`) || [];
		stops.value = data;

	}

	async function getRoutes() {

		routes.value = [];
		const data = await stopService.getRoutesById(currentStop.value.id);
		routes.value = data;

	}

	async function getVehicles() {

		vehicles.value = [];
		const data = await routeService.getVehiclesById(currentRoute.value.id);
		vehicles.value = data;

	}

	async function selectStop(stop) {

		currentStop.value = stop;

		map.setPosition(new LatLng(stop.coordinates.lat, stop.coordinates.lon));
		map.setZoom(18);

		map.clearMarkers();
		map.addMarker({
			id: "currentStop",
			position: new LatLng(stop.coordinates.lat, stop.coordinates.lon)
		});

		await getRoutes();

	}

	async function selectRoute(route) {

		currentRoute.value = route;

		map.setZoom(11);

		map.clearMarkers();
		vehicles.value.forEach((vehicle) => {

			map.addMarker({
				id: `vehicle${vehicle.tripId}`,
				position: new LatLng(
					vehicle.coordinates.lat,
					vehicle.coordinates.lon
				)
			});

		});

		await getVehicles();

	}

	async function selectVehicle(vehicle) {

		const shape = await tripService.getShapeById(vehicle.tripId);
		currentVehicle.value = vehicle;
		movingVehicle.value = new MovingVehicle(vehicle, shape);

		map.setPosition(new LatLng(vehicle.coordinates.lat, vehicle.coordinates.lon));
		map.setZoom(18);

		map.clearMarkers();
		map.addMarker({
			id: "currentVehicle",
			position: computed(() => { 

				const vehiclePosition = movingVehicle.value.getPosition();

				return new LatLng(vehiclePosition.lat, vehiclePosition.lon) 

			})
		});

		map.clearPolylines();
		map.addPolyline({
			id: shape.id,
			parts: shape.parts.map((part) => new LatLng(part.coordinates.lat, part.coordinates.lon))
		});


	}

	function handleSearchBarInput() {

		searchStops(searchInput.value);

	}

	function clearSearchBar() {

		searchInput.value = "";

	}

	function updateCurrentVehiclePositon(deltaTime) {

		currentDistanceTraveled += (60 / 3.6) * deltaTime;
		const point = along(currentShapeLine, currentDistanceTraveled, { units: "meters" });

		currentVehiclePosition.value = { lat: point.geometry.coordinates[1], lon: point.geometry.coordinates[0] };

	}

	function back() {

		if (currentVehicle.value) {

			currentVehicle.value = null;
			selectRoute(currentRoute.value);
			map.clearMarkers();
			map.clearPolylines();

		} else if (currentRoute.value) {

			currentRoute.value = null;
			vehicles.value = [];
			selectStop(currentStop.value);

		} else if (currentStop.value) {

			currentStop.value = null;
			routes.value = [];
			map.clearMarkers();

		}

	}

	onMounted(() => {

		let lastTime = new Date();

		setInterval(() => {

			const now = new Date();
			const deltaTime = (now - lastTime) / 1000;
			lastTime = now;

			if (movingVehicle.value) {
				movingVehicle.value.update(deltaTime);
			}

		}, 1000 / 60);

		setInterval( async () => {

			if (movingVehicle.value) {

				 const vehicle = await tripService.getVehicleById(currentVehicle.value.tripId);
				 if (vehicle.coordinates.lat != currentVehicle.value.coordinates.lat) {

					currentVehicle.value = vehicle;
					movingVehicle.value.correct(vehicle);

				 }

			}

		}, 1000 * 5);

	});

	

</script>

<template>
	<div class="absolute right-0 top-0 flex flex-col z-1000 max-w-120 w-full h-screen overflow-y-auto bg-surface p-4 gap-6 rounded-l-lg">

		<!-- Back button -->
		<div class="cursor-pointer">
			<div @click="back()">
				<IonIcon :icon="arrowBack" class="text-2xl text-text-secondary" />
			</div>
		</div>

		<!-- Search type  -->
		<div class="flex gap-2 justify-center items-center" v-if="!currentStop">

			<div class="flex justify-center items-center gap-2">
				<div class="flex justify-center items-center p-2 bg-surface-tertiary rounded-md">
					<IonIcon :icon="layers" class="text-xl text-text-secondary" />
				</div>
				<p class="text-text-primary">
					By Stop
				</p>
			</div>

			<div class="flex justify-center items-center gap-2">
				<div class="flex justify-center items-center p-2 bg-surface-tertiary rounded-md">
					<IonIcon :icon="swapHorizontal" class="text-xl text-text-secondary" />
				</div>
				<p class="text-text-primary">
					By Route
				</p>
			</div>

		</div>

		<SearchBar @input="handleSearchBarInput" v-model="searchInput" v-if="!currentStop"/>

		<div class="flex flex-col gap-1.5">

			<SelectedResultCard 
				title="Stop"
				:icon="layers"
				:content="currentStop.name"
				v-if="currentStop"
			/>
			<SearchResultList 
				title="Stops"
				:data="stops"
				:icon="layers"
				:presenter="(stop) => stop.name"
				@select="selectStop"
				v-else
			/>

			<SelectedResultCard 
				title="Route"
				:icon="swapHorizontal"
				:content="currentRoute.name"
				v-if="currentRoute"
			/>
			<SearchResultList 
				title="Routes"
				:data="routes"
				:icon="swapHorizontal"
				:presenter="(route) => route.name"
				@select="selectRoute"
				v-else-if="currentStop"
			/>

			<SelectedResultCard 
				title="Vehicle"
				:icon="bus"
				:content="currentVehicle.tripId"
				v-if="currentVehicle"
			/>
			<SearchResultList 
				title="Vehicles"
				:data="vehicles"
				:icon="bus"
				:presenter="(vehicle) => vehicle.tripId"
				@select="selectVehicle"
				v-else-if="currentRoute"
			/>

		</div>

	</div>
</template>
