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

	import { useSidebarState } from "../../composables/useSidebarState.ts";

	import { ref, computed, onMounted } from "vue";
	import { IonIcon } from "@ionic/vue";
	import { swapHorizontal, layers, bus, arrowBack } from "ionicons/icons";
	import { LatLng } from "leaflet";

	const map = useMap();
	const sidebar = useSidebarState(map);

	const searchInput = ref("");

	function handleSearchBarInput() {

		sidebar.queryStops(searchInput.value);

	}

	onMounted(() => {

		let lastTime = new Date();

		setInterval(() => {

			const now = new Date();
			const deltaTime = (now - lastTime) / 1000;
			lastTime = now;

			sidebar.updateMovingVehicle(deltaTime);

		}, 1000 / 60);

		setInterval(() => {

			sidebar.correctMovingVehicle();

		}, 1000 * 5);

	});

</script>

<template>
	<div class="absolute right-0 top-0 flex flex-col z-1000 max-w-120 w-full h-screen overflow-y-auto bg-surface p-4 gap-6 rounded-l-lg">

		<!-- Back button -->
		<div class="cursor-pointer" v-if="sidebar.selectedStop.value">
			<div @click="sidebar.back">
				<IonIcon :icon="arrowBack" class="text-2xl text-text-secondary" />
			</div>
		</div>

		<!-- Search type  -->
		<div class="flex gap-2 justify-center items-center" v-if="!sidebar.selectedStop.value">

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

		<SearchBar @input="handleSearchBarInput" :autoFocus="true" v-model="searchInput" v-if="!sidebar.selectedStop.value" />

		<div class="flex flex-col gap-1.5">

			<SelectedResultCard 
				title="Stop"
				:icon="layers"
				:content="sidebar.selectedStop.value.name"
				v-if="sidebar.selectedStop.value"
			/>
			<SearchResultList 
				title="Stops"
				:data="sidebar.stops.value"
				:icon="layers"
				:presenter="(stop) => stop.name"
				@select="(vehicle) => sidebar.selectStop(vehicle)"
				v-else
			/>

			<SelectedResultCard 
				title="Route"
				:icon="swapHorizontal"
				:content="sidebar.selectedRoute.value.name"
				v-if="sidebar.selectedRoute.value"
			/>
			<SearchResultList 
				title="Routes"
				:data="sidebar.routes.value"
				:icon="swapHorizontal"
				:presenter="(route) => route.name"
				@select="(route) => sidebar.selectRoute(route)"
				v-else-if="sidebar.selectedStop.value"
			/>

			<SelectedResultCard 
				title="Vehicle"
				:icon="bus"
				:content="sidebar.selectedVehicle.value.tripId"
				v-if="sidebar.selectedVehicle.value"
			/>
			<SearchResultList 
				title="Vehicles"
				:data="sidebar.vehicles.value"
				:icon="bus"
				:presenter="(vehicle) => vehicle.tripId"
				@select="(vehicle) => sidebar.selectVehicle(vehicle)"
				v-else-if="sidebar.selectedRoute.value"
			/>

		</div>

	</div>
</template>
