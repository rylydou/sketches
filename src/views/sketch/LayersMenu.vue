<script lang="ts" setup>
import AddLayerIcon from '@/components/icons/AddLayerIcon.vue'
import LayersMenuLayer from './LayersMenuLayer.vue'

import { useSessionStore, useLocalStore } from '@/store'
import { SketchLayer } from '@/models/Sketch'

var sessionStore = useSessionStore()
</script>

<template>
	<div class="menu">
		<div class="btn" @click="sessionStore.currentLayer = sessionStore.sketch.addLayer()">
			<AddLayerIcon /> Add layer
		</div>
		<div class="layers-list">
			<LayersMenuLayer v-for="layer in sessionStore.sketch.layers" :value="layer" />
		</div>
	</div>
</template>

<style lang="scss" scoped>
.menu {
	display: flex;
	flex-direction: column;

	gap: 12px;

	padding: 12px;
	// min-width: 500px;
}

.layers-list {
	display: flex;
	flex-direction: column;

	// max-height: 600px;
	max-height: 75vh;
	overflow-y: scroll;
}
</style>
