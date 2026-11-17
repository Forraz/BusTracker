<script setup lang="ts">

	import SearchBar from "./SearchBar.vue";
	import SearchResultList from "./SearchResultList.vue";
	import SelectedResultCard from "./SelectedResultCard.vue";

	import FadeTransition from "../Transitions/FadeTransition.vue";

    import { ref } from "vue";

	import { useMap } from "../../composables/useMap.ts";
	import { useSidebarState } from "../../composables/useSidebarState.ts";

	import { IonIcon } from "@ionic/vue";
	import { swapHorizontal, layers, bus, arrowBack } from "ionicons/icons";
	import { LatLng } from "leaflet";

	const map = useMap();
	const sidebar = useSidebarState(map);

	const searchInput = ref("");

	function handleSearchBarInput() {

		sidebar.queryStops(searchInput.value);

	}

</script>

<template>
	<div class="absolute right-0 top-0 flex flex-col z-1000 max-w-120 w-full h-screen overflow-y-auto bg-surface p-4 gap-6 rounded-l-lg">

		<FadeTransition>

			<!-- Back button -->
			<div class="flex item-center" v-if="sidebar.selectedStop.value">
				<button class="justify-self-start cursor-pointer" @click="sidebar.back" >
					<IonIcon :icon="arrowBack" class="text-2xl text-text-secondary" />
				</button>
			</div>
		
		</FadeTransition>

		<SearchBar @input="handleSearchBarInput" :autoFocus="true" v-model="searchInput" v-if="!sidebar.selectedStop.value" />

		<div class="flex flex-col gap-1.5">

			<FadeTransition>
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
					@select="(stop) => sidebar.selectStop(stop)"
					v-else
				/>
			</FadeTransition>

			<FadeTransition>
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
			</FadeTransition>

			<FadeTransition>
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
			</FadeTransition>

		</div>

	</div>
</template>
