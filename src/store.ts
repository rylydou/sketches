import { ref, computed, reactive } from 'vue'
import { defineStore } from 'pinia'

import { TouchCalibrationMode } from '@/types'
import { Sketch } from '@/models/Sketch'

export const useSessionStore = defineStore('session', () => {
	var brushConfig = reactive({
		sizeFactor: 1,
		color: '#000000',
		eraserSelected: false,
	})

	var brushSizePx = computed(() => Math.pow(2.0, brushConfig.sizeFactor))

	return {
		brushConfig,
		brushSizePx,
	}
})

export const useLocalStore = defineStore('local', () => {
	var drawingConfig = reactive({
		smoothing: 5,
		shapeClosingDistance: 16,
		touchCalibrationMode: TouchCalibrationMode.Stylus,
	})

	var fingerCalibration = reactive({
		offsetY: -16,
		releaseTimeMs: 0,
	})

	var stylusCalibration = reactive({
		offsetY: 0,
		releaseTimeMs: 100,
	})

	return {
		drawingConfig,
		fingerCalibration,
		stylusCalibration,
	}
})

export const useSketchStore = defineStore('sketch', () => {
	let dpi = 150
	let sketch = new Sketch(11 * dpi, 8.5 * dpi)

	return sketch
})
