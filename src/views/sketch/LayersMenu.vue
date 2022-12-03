<script lang="ts" setup>
import Button from '@/components/Button.vue'
import AddLayerIcon from '@/components/icons/AddLayerIcon.vue'
import LayersMenuLayer from './LayersMenuLayer.vue'

import { useSessionStore, useLocalStore } from '@/store'
import { SketchLayer } from '@/models/Sketch'

var sessionStore = useSessionStore()
</script>

<template>
	<div class="menu">
		<Button @press="sessionStore.currentLayer = sessionStore.sketch.addLayer()">
			<AddLayerIcon /> Add layer
		</Button>
		<div class="layers-list">
			<LayersMenuLayer v-for="layer in sessionStore.sketch.layers" :key="layer.name.slice(-1)"
				:value="layer" />
		</div>
	</div>
</template>

<style lang="scss" scoped>
.menu {
	display: flex;
	flex-direction: column;

	gap: 12px;

	padding: 12px;
	max-height: 75vh;
}

.layers-list {
	position: relative;

	display: flex;
	flex-direction: column;
	gap: 8px;

	// max-height: 600px;
	overflow-y: overlay;
	overflow-x: hidden;

	&:empty {
		display: none;
	}
}
</style>
