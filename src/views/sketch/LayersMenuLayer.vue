<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'

import type { SketchLayer } from '@/models/Sketch'
import { useSessionStore } from '@/store'
import TrashIcon from '@/components/icons/TrashIcon.vue'
import Button from '@/components/Button.vue'
import SwapIconButton from '@/components/SwapIconButton.vue'
import { Dropdown } from 'floating-vue'
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
	<div class="layer" :active="sessionStore.currentLayer == props.value">
		<canvas ref="ref_thumbnail" class="thumbnail" width="165" height="128"
			@click="sessionStore.currentLayer = props.value" />
		<div class="info">
			<div class="name">{{ value.name }}</div>
			<div class="buttons">
				<SwapIconButton v-model="props.value.isHidden">
				</SwapIconButton>
				<div class="grow"></div>
				<Dropdown>
					<Button>
						<TrashIcon />
					</Button>

					<template #popper>
						<Button class="danger" @press="sessionStore.sketch.removeLayer(props.value)">
							<TrashIcon /> Delete
						</Button>
					</template>
				</Dropdown>
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
			border-color: black;
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
	border: solid 2px hsl(0 0% 90% / 1.0);
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
