<script setup lang="ts">

	import { ref, onMounted } from "vue";
	import { IonIcon } from "@ionic/vue";
	import { search } from "ionicons/icons";

	const props = defineProps<{
		autoFocus?: boolean
	}>()

	const searchInput = defineModel();

	const emit = defineEmits(["input"]);
	const inputElement = ref(null);

	function emitInput() {

		emit("input");

	}

	function focus() {

		if (inputElement.value) {

			inputElement.value.focus();

		}

	}

	onMounted(() => { 

		if (props.autoFocus) {

			focus();

		}

	}) 

</script>

<template>

	<div>
		<div class="border-border border p-2 w-full rounded-lg flex items-center gap-2">
			<IonIcon :icon="search" class="text-xl text-text-secondary" />
			<input 
				class="block text-text-primary placeholder:text-secondary focus:outline-none w-full" 
				type="text"
				placeholder="Enter a stop name"
				ref="inputElement"
				v-model="searchInput"
				@input="emitInput"
			/>
		</div>
	</div>

</template>
