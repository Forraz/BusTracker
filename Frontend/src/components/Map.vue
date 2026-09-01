<script setup>

	import "leaflet/dist/leaflet.css";
	import { LatLng } from "leaflet";
	import { LMap, LTileLayer } from "@vue-leaflet/vue-leaflet";
	import { onMounted } from "vue";

	const zoom = defineModel("zoom", { default: 15 });
	const position = defineModel("position", { default: new LatLng(0, 0) });

	onMounted(() => {

		navigator.geolocation.getCurrentPosition((pos) => {

				position.value = new LatLng(
					pos.coords.latitude,
					pos.coords.longitude
				);

			}, (e) => { 

				console.log(e); 

			}, {

				enableHighAccuracy: true,
				timeout: 5000,
				maximumAge: 0

			}
		);

	});

</script>

<template>
	<div style="width: 100vw; height: 100vh;">
		<LMap v-model:zoom="zoom" v-model:center="position">
			<LTileLayer
				url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				layer-type="base"
				name="OpenStreetMap"
			/>
		</LMap>
	</div>
</template>
