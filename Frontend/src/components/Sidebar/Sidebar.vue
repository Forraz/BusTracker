<script setup lang="ts">

	import stopService from "../../api/services/stop.service.ts";
	import routeService from "../../api/services/route.service.ts";
	import tripService from "../../api/services/trip.service.ts";

	import SearchBar from "./SearchBar.vue";
	import SearchResultList from "./SearchResultList.vue";
	import SelectedResultCard from "./SelectedResultCard.vue";

	import { ref, onMounted } from "vue";
	import { IonIcon } from "@ionic/vue";
	import { swapHorizontal, layers, bus } from "ionicons/icons";

	const props = defineProps({
		updatePosition: {
			type: Function,
			required: true
		}
	});

	let stops = ref([]);
	let routes = ref([]);
	let vehicles = ref([]);

	let currentStop = ref(null);
	let currentRoute = ref(null);
	let currentVehicle = ref(null);

	async function searchStops(stopName) {

		const data = await stopService.query(`name=${stopName}`) || [];
		stops.value = data;

	}

	async function getRoutes() {

		const data = await stopService.getRoutesById(currentStop.value.id);
		routes.value = data;

	}

	async function getVehicles() {

		const data = await routeService.getVehiclesById(currentRoute.value.id);
		vehicles.value = data;

	}

	function selectStop(stop) {

		props.updatePosition(stop.coordinates.lat, stop.coordinates.lon);
		currentStop.value = stop;
		getRoutes();

	}

	function selectRoute(route) {

		currentRoute.value = route;
		getVehicles();

	}

	function selectVehicle(vehicle) {

		currentVehicle.value = vehicle;
		props.updatePosition(vehicle.coordinates.lat, vehicle.coordinates.lon);

	}

	function handleSearchBarInput(input) {

		searchStops(input);

	}
	

</script>

<template>
	<div class="absolute right-0 top-0 h-screen flex flex-col z-1000 min-w-120 bg-surface p-4 gap-6 rounded-l-lg">

		<!-- Search type  -->
		<div class="flex gap-2 justify-center items-center">

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

		<SearchBar @input="handleSearchBarInput" />

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
			v-else
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
			v-else
		/>

	</div>
</template>
