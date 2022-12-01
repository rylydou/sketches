<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { hideAllPoppers } from 'floating-vue'

import type { SketchLayer } from '@/models/Sketch'

import Button from '@/components/Button.vue'
import DangerButton from '@/components/DangerButton.vue'
import SwapIconButton from '@/components/SwapIconButton.vue'
import TrashIcon from '@/components/icons/TrashIcon.vue'

import { useSessionStore } from '@/store'
import ShownIcon from '@/components/icons/ShownIcon.vue'
import HiddenIcon from '@/components/icons/HiddenIcon.vue'
let sessionStore = useSessionStore()

let ref_thumbnail = ref<HTMLCanvasElement>()

let props = defineProps<{
	value: SketchLayer
}>()

onMounted(() => {
	updateThumbnail()
})

function updateThumbnail() {
	let ctx = ref_thumbnail.value!.getContext('2d')!
	ctx.imageSmoothingEnabled = true
	ctx.imageSmoothingQuality = 'high'
	ctx.scale(1, 1)
	ctx.clearRect(0, 0, ref_thumbnail.value!.width, props.value.canvas.height)

	ctx.scale(ref_thumbnail.value!.width / props.value.canvas.width, ref_thumbnail.value!.height / props.value.canvas.height)
	ctx.drawImage(props.value.canvas, 0, 0)
}

function pickLayer() {
	sessionStore.currentLayer = props.value
	// setTimeout(() => hideAllPoppers(), 2000)
}

</script>

<template>
	<div class="layer" :active="sessionStore.currentLayer == props.value">
		<canvas ref="ref_thumbnail" class="thumbnail" width="165" height="128" @click="pickLayer()" />
		<div class="info">
			<div class="name">{{ value.name }}</div>
			<div class="buttons">
				<SwapIconButton class="pop" v-model="props.value.isHidden">
					<template #on>
						<ShownIcon />
					</template>
					<template #off>
						<HiddenIcon />
					</template>
				</SwapIconButton>
				<div class="grow"></div>
				<DangerButton @press="sessionStore.sketch.removeLayer(props.value)">
					<TrashIcon />
				</DangerButton>
			</div>
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
	width: 400px;

	&[active="true"] {
		.thumbnail {
			outline-color: black;
			outline-offset: 2px;
			transition: scale 200ms cubic-bezier(0.34, 1.56, 0.64, 1), outline-color 200ms;
		}

		.name::after {
			// content: ' 🡐';
		}
	}
}

.buttons {
	display: flex;
	flex-direction: row;
}

.thumbnail {
	cursor: pointer;
	image-rendering: optimizeQuality;
	border-radius: 6px;
	// box-shadow: 0 0 0 2px hsl(0 0% 90% / 1.0);
	outline: solid 2px hsl(0 0% 90% / 1.0);
	outline-offset: 2px;
	// transition when failed
	transition: scale 400ms cubic-bezier(0.22, 1, 0.36, 1), outline-color 0ms;

	&:active {
		scale: 0.9;
		transition: scale 50ms, outline-color 50ms;
		outline-color: lightgray;
	}
}

.info {
	flex-grow: 1;

	display: flex;
	flex-direction: column;
	justify-content: center;
}

.name {
	font-size: 20px;
	line-height: 24px;
	padding: 12px;
	font-weight: bold;
}

.delete-conf {
	display: flex;
	padding: 12px;
}
</style>
