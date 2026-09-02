<script setup>

	import { ref, defineEmits } from "vue";
	import { IonIcon } from "@ionic/vue";
	import { search } from "ionicons/icons";

	const emit = defineEmits(["input"]);

	function emitInput(e) {

		emit("input", e.target.value);

	}

</script>

<template>

	<div>
		<div class="border-border border p-2 w-full rounded-lg flex items-center gap-2">
			<IonIcon :icon="search" class="text-xl text-text-secondary" />
			<input 
				class="block text-text-primary placeholder:text-secondary focus:outline-none w-full" 
				type="text"
				placeholder="Enter a stop name"
				@input="emitInput"
			/>
		</div>
	</div>

</template>
