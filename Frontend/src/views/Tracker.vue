<script setup lang="ts">

	import Map from "../components/Map.vue";
	import Sidebar from "../components/Sidebar.vue";
	import { LatLng } from "leaflet";
	import { ref } from "vue";
	import { useRouter, useRoute } from "vue-router";

	const position = ref(new LatLng(0, 0));

	function updatePosition(lat: number, lon: number) {

		position.value = new LatLng(lat, lon);

	}

	const router = useRouter()
	const route = useRoute()

</script>

<template>

	<div class="relative">
		<Map v-model:position='position' />
		<Sidebar :updatePosition='updatePosition' />
	</div>
	
</template>

<style scoped></style>
