
<script setup lang="ts">

	import { computed, ref } from "vue";
	import { IonIcon } from "@ionic/vue";
	import { chevronDown } from "ionicons/icons";

	const isOpen = ref<boolean>(true);

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

	function handleListOpenButton() {

		isOpen.value = !isOpen.value

	}

</script>

<template>

	<div class="flex flex-col gap-1">

		<div class="ml-1 gap-1 flex items-center">
			<button @click="handleListOpenButton" class="flex items-center justify-center cursor-pointer">
				<IonIcon :icon="chevronDown" class="text-m text-text-secondary transition-transform" :class="{ 'rotate-180': isOpen }" />
			</button>
			<p class="text-text-secondary text-sm font-semibold uppercase">
				{{ props.title }}
			</p>
		</div>

		<div class="overflow-hidden">
			<div class="flex flex-col border-border border rounded-lg divide-border divide-y transition-transform ease-in" :class="{ '-translate-y-full': !isOpen }">
				<div v-for="item in props.data" class="hover:bg-sucrface-secondary">
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

	</div>

</template>
