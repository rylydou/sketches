<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'

import type { SketchLayer } from '@/models/Sketch'
import { useSessionStore } from '@/store'
let sessionStore = useSessionStore()

let ref_thumbnail = ref<HTMLCanvasElement>()

let props = defineProps<{
	value: SketchLayer
}>()

onMounted(() => {
	updateThumbnail()
})

function updateThumbnail() {
	console.log('updating thumbnail for ' + props.value.name)

	let ctx = ref_thumbnail.value!.getContext('2d')!
	ctx.scale(1, 1)
	ctx.clearRect(0, 0, ref_thumbnail.value!.width, props.value.canvas.height)

	ctx.scale(ref_thumbnail.value!.width / props.value.canvas.width, ref_thumbnail.value!.height / props.value.canvas.height)
	ctx.drawImage(props.value.canvas, 0, 0)
}

</script>

<template>
	<div class="layer" @click="sessionStore.currentLayer = props.value"
		:active="sessionStore.currentLayer == props.value">
		<canvas ref="ref_thumbnail" class="thumbnail" width="110" height="85" />
		<div class="info">
			<div class="name">{{ value.name }}</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.layer {
	display: flex;
	flex-direction: row;
	gap: 12px;
	padding: 6px;
	border-radius: 12px;

	&[active="true"] {
		.name::after {
			content: '🡐';
			padding-left: 4px;
		}

		// background-color: hsl(200 100% 95% / 1.0);
	}
}

.thumbnail {
	image-rendering: optimizeQuality;
	border-radius: 6px;
	border: solid 2px hsl(0% 0% 90% / 1.0);
}

.info {
	display: flex;
	flex-direction: column;
	justify-content: center;
}

.name {
	font-size: 20px;
	line-height: 24px;
	font-weight: bold;
}
</style>
