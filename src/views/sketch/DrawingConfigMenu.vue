<script lang="ts" setup>
import EditIcon from '@/components/icons/EditIcon.vue'
import { useLocalStore } from '@/store'

import { TouchCalibrationMode } from '@/types'
import { computed, ref } from 'vue'

var localStore = useLocalStore()

</script>

<template>
	<div class="menu">

		<!-- <div class="h-group fill">
			<div class="btn">Reset...</div>
			<div class="btn">More settings ➙</div>
		</div> -->

		<div class="section">
			<div class="header">Smoothing amount</div>
			<div class="content">
				<div style="font-size: 18px; width: 32px;">{{
						localStore.drawingConfig.smoothing
				}}</div>
				<input type="range" v-model="localStore.drawingConfig.smoothing" min="0" max="90" step="5">
			</div>
		</div>

		<div class="section">
			<div class="header">Closing distance</div>
			<div class="content">
				<div style="font-size: 18px; width: 32px;">{{
						localStore.drawingConfig.shapeClosingDistance
				}}</div>
				<input type="range" v-model="localStore.drawingConfig.shapeClosingDistance" min="0" max="90"
					step="10">
			</div>
		</div>

		<div class="section">
			<div class="header">Touch calibration</div>
			<div class="content">
				<div class="radio-group h-group fill">
					<div v-for="mode in TouchCalibrationMode" class="radio"
						:active="computed(() => localStore.drawingConfig.touchCalibrationMode == mode).value"
						@click="localStore.drawingConfig.touchCalibrationMode = mode">
						<EditIcon />
						{{ mode }}
					</div>
				</div>
			</div>
		</div>

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

.section {
	display: flex;
	flex-direction: column;
	// padding: 12px;
	// border: solid 2px hsla(0 0% 90% / 1.0);
	// border-radius: 12px;

	>.header {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		font-size: 16px;
		line-height: 24px;
		padding-bottom: 8px;
	}

	>.content {
		display: flex;
		flex-direction: row;
	}
}
</style>
