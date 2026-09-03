<script setup>

	import "leaflet/dist/leaflet.css";
	import { LatLng } from "leaflet";
	import { LMap, LTileLayer, LMarker } from "@vue-leaflet/vue-leaflet";
	import { onMounted } from "vue";
	import { useMap } from "../composables/useMap.ts";

	const map = useMap();

</script>

<template>
	<div style="width: 100vw; height: 100vh;">
		<LMap v-model:zoom="map.zoom.value" v-model:center="map.position.value">
			<LTileLayer
				url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				layer-type="base"
				name="OpenStreetMap"
			/>
			<div v-for="marker in map.markers.value">
				<LMarker :lat-lng="marker.position"/>
			</div>
		</LMap>
	</div>
</template>
