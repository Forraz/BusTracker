<script setup lang="ts">

	import { IonIcon } from "@ionic/vue";

	const props = defineProps<{
		title: string,
		icon: any,
		content: string
	}>();
	
</script>

<template>

	<div class="flex flex-col gap-1 mb-2">
		<p class="ml-1 text-text-secondary text-sm font-semibold uppercase">
			{{ props.title }}
		</p>
		<div class="bg-border rounded-lg flex items-center gap-2 px-2 py-4">
			<div class="flex justify-center items-center p-2 bg-surface-tertiary rounded-md">
				<IonIcon :icon="props.icon" class="text-xl text-text-secondary" />
			</div>
			<p class="text-text-primary">
				{{ props.content }}
			</p>
		</div>
	</div>

</template>


