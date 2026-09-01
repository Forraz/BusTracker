
<script setup lang="ts">

	import stopService from "../api/services/stop.service.ts";
	import { ref, defineProps } from "vue";

	const props = defineProps({
		updatePosition: {
			type: Function,
			required: true
		}
	});

	let stops = ref([]);
	let name = ref("");

	async function fetchStops() {

		const data = await stopService.query(`name=${name.value}`) || [];
		stops.value = data;

	}

	function focusOnStop(stop) {

		props.updatePosition(stop.coordinates.lat, stop.coordinates.lon);

	}

</script>

<template>
	<div class="absolute right-0 top-0 h-screen flex flex-col z-1000 bg-white">
		<div class="flex">
			<input class="border-black" type="text" v-model="name">
			<button @click="fetchStops()">Search</button>
		</div>
		<div class="flex flex-col gap-2">
			<div v-for="stop in stops">
				<div>
					<button @click=focusOnStop(stop)>{{ stop.name }}</button>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped></style>
