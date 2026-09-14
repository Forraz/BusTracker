
<script setup lang="ts">

	import { IonIcon } from "@ionic/vue";

	const props = defineProps<{
		title: string,
		icon: any,
		data: [any],
		presenter: () => any
	}>();

	const emit = defineEmits<{
		select: [any]
	}>();

	function emitSelect(item) {

		emit("select", item);

	}

</script>

<template>

	<div class="flex flex-col gap-1" v-if="data.length">
		<p class="ml-1 text-text-secondary text-sm font-semibold uppercase">
			{{ props.title }}
		</p>
		<div class="flex flex-col border-border border rounded-lg divide-border divide-y">
			<div v-for="item in props.data" class="hover:bg-surface-secondary">
				<div @click="emitSelect(item)" class="flex items-center gap-2 px-2 py-4 cursor-pointer">
					<div class="flex justify-center items-center p-2 bg-surface-tertiary rounded-md">
						<IonIcon :icon="props.icon" class="text-xl text-text-secondary" />
					</div>
					<p class="text-text-primary">
						{{ presenter(item) }}
					</p>
				</div>
			</div>
		</div>
	</div>

</template>
