<script setup lang="ts">
import NoneIcon from './icons/NoneIcon.vue'
</script>

<template>
	<div class="btn">
		<slot>
			<NoneIcon style="color: red; outline: dashed 1px black; outline-offset: 2px;" />
		</slot>
	</div>
</template>

<style scoped>

</style>
