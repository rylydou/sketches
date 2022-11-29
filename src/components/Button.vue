<script setup lang="ts">
import NoneIcon from './icons/NoneIcon.vue'

let props = defineEmits<{
	(e: 'press'): void
}>()

function click(e: MouseEvent) {
	props('press')
}
</script>

<template>
	<div role="button" class="btn" @click="click">
		<slot>
			<NoneIcon style="color: red; outline: dashed 1px black; outline-offset: 2px;" />
		</slot>
	</div>
</template>

<style scoped>

</style>
