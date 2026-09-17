
<script setup lang="ts">

	

</script>

<template>

	<Transition 
		enter-active-class="duration-150 ease-in"
		enter-from-class="opacity-0"
		enter-to-class="opacity-100"

		leave-active-class="duration-150 ease-out"
		leave-from-class="opacity-100"
		leave-to-class="opacity-0"

		mode="out-in"
		appear
	>
		<slot></slot>
	</Transition>

</template>
