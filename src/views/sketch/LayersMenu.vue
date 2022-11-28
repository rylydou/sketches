<script lang="ts" setup>
import { TouchCalibrationMode } from '@/types'
import { hideAllPoppers } from 'floating-vue'
import { computed, onMounted, ref } from 'vue'

import BarItem from '@/components/BarItem.vue'
import EditIcon from '@/components/icons/EditIcon.vue'
import { useLocalStore, useSketchStore } from '@/store'

import LayersMenuLayer from './LayersMenuLayer.vue'

var localStore = useLocalStore()
var sketchStore = useSketchStore()


</script>

<template>
	<div class="menu">
		<LayersMenuLayer v-for="layer in sketchStore.layers" :value="layer" />
	</div>
</template>

<style lang="scss" scoped>
.menu {
	display: flex;
	flex-direction: column;
	padding: 12px;
	gap: 16px;
	width: 400px;
}

.layer {
	display: flex;
	flex-direction: row;
}

.preview {
	aspect-ratio: 11 / 8.5;
	width: 64px;
	height: 64px;

	border: solid 2px hsl(0 0% 90% / 1.0);
	border-radius: 12px;
}
</style>
