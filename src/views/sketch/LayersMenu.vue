<script lang="ts" setup>
import { TouchCalibrationMode } from '@/types'
import { hideAllPoppers } from 'floating-vue'
import { computed, onMounted, ref } from 'vue'

import BarItem from '@/components/BarItem.vue'
import EditIcon from '@/components/icons/EditIcon.vue'
import { useSessionStore, useLocalStore } from '@/store'

import LayersMenuLayer from './LayersMenuLayer.vue'
import { SketchLayer } from '@/models/Sketch'

var localStore = useLocalStore()
var sessionStore = useSessionStore()
</script>

<template>
	<div class="menu">
		<div class="layers-list">
			<LayersMenuLayer v-for="layer in sessionStore.sketch.layers" :value="layer" />
		</div>
		<div class="btn" @click="sessionStore.sketch.addLayer()">
			Add layer
		</div>
	</div>
</template>

<style lang="scss" scoped>
.menu {
	display: flex;
	flex-direction: column;

	gap: 12px;

	padding: 12px;
	min-width: 400px;
}

.layers-list {
	display: flex;
	flex-direction: column;

	max-height: 400px;
	overflow-y: scroll;
}
</style>
