
<script setup lang="ts">

	import stopService from "../api/services/stop.service.ts";
	import { ref, defineProps } from "vue";
	import { IonIcon } from "@ionic/vue";
	import { search, swapHorizontal } from "ionicons/icons";

	const props = defineProps({
		updatePosition: {
			type: Function,
			required: true
		}
	});

	let stops = ref([]);
	let name = ref("");

	let currentStop = ref(null);

	async function searchStops() {

		const data = await stopService.query(`name=${name.value}`) || [];
		stops.value = data;

	}

	function focusOnStop(stop) {

		props.updatePosition(stop.coordinates.lat, stop.coordinates.lon);
		currentStop.value = stop;

	}

</script>

<template>
	<div class="absolute right-0 top-0 h-screen flex flex-col z-1000 min-w-120 bg-surface py-4 px-4 gap-6 rounded-l-lg">

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

		<div v-if="!currentStop && stops.length">
			<div class="flex flex-col gap-1">
				<p class="ml-1 text-text-secondary text-sm font-semibold uppercase">Stops</p>
				<div class="flex flex-col border-border border rounded-lg divide-border divide-y overflow-y-auto">
					<div v-for="stop in stops" class="hover:bg-surface-secondary">
						<div @click=focusOnStop(stop) class="flex items-center gap-2 px-2 py-4 cursor-pointer">
							<div class="flex justify-center items-center p-2 bg-surface-tertiary rounded-md">
								<IonIcon :icon="swapHorizontal" class="text-xl text-text-secondary" />
							</div>
							<p class="text-text-primary">{{ stop.name }}</p>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div v-else-if="currentStop != null">
			<div class="flex flex-col gap-1">
				<p class="ml-1 text-text-secondary text-sm font-semibold uppercase">
					Stop
				</p>
				<div class="bg-border rounded-lg flex items-center gap-2 px-2 py-4">
					<div class="flex justify-center items-center p-2 bg-surface-tertiary rounded-md">
						<IonIcon :icon="swapHorizontal" class="text-xl text-text-secondary" />
					</div>
					<p class="text-text-primary">
						{{ currentStop.name }}
					</p>
				</div>
			</div>
		</div>

		<div v-else>
			<div class="border-border border rounded-lg bg-surface-secondary px-2 py-4">
				<p class="text-text-primary text-lg text-center">
					Type a stop name in the searchbar and press enter
				</p>
			</div>
		</div>


	</div>
</template>

<style scoped></style>
