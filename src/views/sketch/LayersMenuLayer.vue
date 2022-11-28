<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'

import type { SketchLayer } from '@/models/Sketch'

let ref_thumbnail = ref<HTMLCanvasElement>()

let props = defineProps<{
	value: SketchLayer
}>()

onMounted(() => {
	updateThumbnail()
})

function updateThumbnail() {
	console.log('updating thumbnail for ' + props.value.name)

	let x = props.value.ctx
	x.lineWidth = 16
	x.beginPath()
	x.arc(200, 200, 300, 0, Math.PI * 1.5)
	x.stroke()

	let ctx = ref_thumbnail.value!.getContext('2d')!
	ctx.scale(1, 1)
	ctx.clearRect(0, 0, ref_thumbnail.value!.width, props.value.canvas.height)

	ctx.scale(ref_thumbnail.value!.width / props.value.canvas.width, ref_thumbnail.value!.height / props.value.canvas.height)
	ctx.drawImage(props.value.canvas, 0, 0)
}

</script>

<template>
	<div class="layer" @mouseenter="updateThumbnail()">
		<canvas width="110" height="85" ref="ref_thumbnail" />
		{{ value.name }}
	</div>
</template>

<style lang="scss" scoped>
.layer {}
</style>
