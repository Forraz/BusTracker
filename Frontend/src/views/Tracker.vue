<script setup lang="ts">

	import Map from "../components/Map.vue";
	import Sidebar from "../components/Sidebar/Sidebar.vue";
	import ThemeSwitch from "../components/ThemeSwitch.vue";
	import { ref, provide } from "vue";
	import { useRouter, useRoute } from "vue-router";
	import { useMapState } from "../composables/useMapState.ts";

	const router = useRouter()
	const route = useRoute()
	
	const map = useMapState();
	provide("map", map);

</script>

<template>

	<div class="relative">
		<Map />
		<Sidebar />
		<ThemeSwitch />
	</div>
	
</template>

<style scoped></style>
