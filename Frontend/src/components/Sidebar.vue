<script setup lang="ts">

	import stopService from "../api/services/stop.service.ts";
	import routeService from "../api/services/route.service.ts";
	import tripService from "../api/services/trip.service.ts";

	import { ref, defineProps, onMounted } from "vue";
	import { IonIcon } from "@ionic/vue";
	import { search, swapHorizontal, layers, bus } from "ionicons/icons";

	const props = defineProps({
		updatePosition: {
			type: Function,
			required: true
		}
	});

	let stops = ref([]);
	let routes = ref([]);
	let vehicles = ref([]);

	let name = ref("");

	let currentStop = ref(null);
	let currentRoute = ref(null);
	let currentVehicle = ref(null);

	async function searchStops() {

		const data = await stopService.query(`name=${name.value}`) || [];
		stops.value = data;

	}

	async function getRoutes() {

		const data = await stopService.getRoutesById(currentStop.value.id);
		routes.value = data;

	}

	async function getVehicles() {

		const data = await routeService.getVehiclesById(currentRoute.value.id);
		console.log(data);
		vehicles.value = data;

	}

	function setCurrentStop(stop) {

		props.updatePosition(stop.coordinates.lat, stop.coordinates.lon);
		currentStop.value = stop;
		getRoutes();

	}

	function setCurrentRoute(route) {

		currentRoute.value = route;
		getVehicles();

	}

	function setCurrentVehicle(vehicle) {

		currentVehicle.value = vehicle;
		props.updatePosition(vehicle.coordinates.lat, vehicle.coordinates.lon);

	}

	async function updateCurrentVehicle() {

		setCurrentVehicle(await tripService.getVehicleById(currentVehicle.value.tripId));

	}

	onMounted(() => {

		setInterval(() => {

			if (currentVehicle.value) {
				updateCurrentVehicle();
			}

		}, 5 * 1000);
	});

	

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

		<!-- Searchbar -->
		<div>
			<div class="border-border border p-2 w-full rounded-lg flex items-center gap-2">
				<IonIcon :icon="search" class="text-xl text-text-secondary" />
				<input 
					class="block text-text-primary placeholder:text-secondary focus:outline-none w-full" 
					type="text"
					v-model="name"
					placeholder="Enter a stop name"
					@keyup.enter="searchStops"
				/>
			</div>
		</div>

		<div v-if="currentStop">

			<!-- Current stop -->
			<div class="flex flex-col gap-1">
				<p class="ml-1 text-text-secondary text-sm font-semibold uppercase">
					Stop
				</p>
				<div class="bg-border rounded-lg flex items-center gap-2 px-2 py-4">
					<div class="flex justify-center items-center p-2 bg-surface-tertiary rounded-md">
						<IonIcon :icon="layers" class="text-xl text-text-secondary" />
					</div>
					<p class="text-text-primary">
						{{ currentStop.name }}
					</p>
				</div>
			</div>

		</div>

		<div v-if="currentRoute">

			<!-- Current route -->
			<div class="flex flex-col gap-1">
				<p class="ml-1 text-text-secondary text-sm font-semibold uppercase">
					Route
				</p>
				<div class="bg-border rounded-lg flex items-center gap-2 px-2 py-4">
					<div class="flex justify-center items-center p-2 bg-surface-tertiary rounded-md">
						<IonIcon :icon="swapHorizontal" class="text-xl text-text-secondary" />
					</div>
					<p class="text-text-primary">
						{{ currentRoute.name }}
					</p>
				</div>
			</div>

		</div>

		<div v-if="currentVehicle">

			<!-- Current vehicle -->
			<div class="flex flex-col gap-1">
				<p class="ml-1 text-text-secondary text-sm font-semibold uppercase">
					Vehicle
				</p>
				<div class="bg-border rounded-lg flex items-center gap-2 px-2 py-4">
					<div class="flex justify-center items-center p-2 bg-surface-tertiary rounded-md">
						<IonIcon :icon="bus" class="text-xl text-text-secondary" />
					</div>
					<p class="text-text-primary">
						{{ currentVehicle.tripId }}
					</p>
				</div>
			</div>

		</div>

		<div v-if="stops.length && !currentStop">

			<!-- Stop list -->
			<div class="flex flex-col gap-1">
				<p class="ml-1 text-text-secondary text-sm font-semibold uppercase">
					Stops
				</p>
				<div class="flex flex-col border-border border rounded-lg divide-border divide-y overflow-y-auto">
					<div v-for="stop in stops" class="hover:bg-surface-secondary">
						<div @click=setCurrentStop(stop) class="flex items-center gap-2 px-2 py-4 cursor-pointer">
							<div class="flex justify-center items-center p-2 bg-surface-tertiary rounded-md">
								<IonIcon :icon="layers" class="text-xl text-text-secondary" />
							</div>
							<p class="text-text-primary">
								{{ stop.name }}
							</p>
						</div>
					</div>
				</div>
			</div>

		</div>

		<div v-if="routes.length && !currentRoute">

			<!-- Route list -->
			<div class="flex flex-col gap-1">
				<p class="ml-1 text-text-secondary text-sm font-semibold uppercase">
					Routes
				</p>
				<div class="flex flex-col border-border border rounded-lg divide-border divide-y overflow-y-auto">
					<div v-for="route in routes" class="hover:bg-surface-secondary">
						<div @click="setCurrentRoute(route)" class="flex items-center gap-2 px-2 py-4 cursor-pointer">
							<div class="flex justify-center items-center p-2 bg-surface-tertiary rounded-md">
								<IonIcon :icon="swapHorizontal" class="text-xl text-text-secondary" />
							</div>
							<p class="text-text-primary">
								{{ route.name }}
							</p>
						</div>
					</div>
				</div>
			</div>

		</div>

		<div v-if="vehicles.length && !currentVehicle">

			<!-- Vehicle list -->
			<div class="flex flex-col gap-1">
				<p class="ml-1 text-text-secondary text-sm font-semibold uppercase">
					Vehicles
				</p>
				<div class="flex flex-col border-border border rounded-lg divide-border divide-y overflow-y-auto">
					<div v-for="vehicle in vehicles" class="hover:bg-surface-secondary">
						<div @click="setCurrentVehicle(vehicle)" class="flex items-center gap-2 px-2 py-4 cursor-pointer">
							<div class="flex justify-center items-center p-2 bg-surface-tertiary rounded-md">
								<IonIcon :icon="bus" class="text-xl text-text-secondary" />
							</div>
							<p class="text-text-primary">
								{{ vehicle.tripId }}
							</p>
						</div>
					</div>
				</div>
			</div>

		</div>

	</div>
</template>

<style scoped></style>
