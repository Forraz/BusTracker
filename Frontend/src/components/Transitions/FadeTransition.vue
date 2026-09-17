
<script setup lang="ts">

	

</script>

<template>

	<Transition 
		enter-active-class="duration-250 ease-in"
		enter-from-class="opacity-0"
		enter-to-class="opacity-100"

		leave-active-class="duration-250 ease-in"
		leave-from-class="opacity-100"
		leave-to-class="opacity-0"

		mode="out-in"
		appear
	>
		<slot></slot>
	</Transition>

</template>
