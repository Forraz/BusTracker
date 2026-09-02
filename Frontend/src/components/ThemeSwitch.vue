<script setup lang="ts">

	import { IonIcon } from "@ionic/vue";
	import { sunny, moon } from "ionicons/icons";
	import { ref } from "vue";

	type Theme = "dark" | "light";

	const themeState = ref<Theme>("light");

	function switchTheme() {

		themeState.value = themeState.value == "dark" ? "light" : "dark";
		document.body.setAttribute("data-theme", themeState.value);

	}

</script>

<template>

	<div 
		class="absolute left-5 bottom-5 rounded-full w-10 h-10 bg-text-primary z-1000 flex justify-center items-center"
		@click="switchTheme()"
	>
		<IonIcon :icon='sunny' v-if="themeState === 'dark'" class="text-text-muted text-xl" />
		<IonIcon :icon='moon' v-else class="text-text-muted text-xl" />
	</div>

</template>

<style scoped></style>
