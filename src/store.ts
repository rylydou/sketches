import { ref, computed, reactive } from 'vue'
import { defineStore } from 'pinia'

import { TouchCalibrationMode } from '@/types'
import { Sketch, SketchLayer } from '@/models/Sketch'

export const useSessionStore = defineStore('session', () => {
	let brushConfig = reactive({
		sizeFactor: 1,
		color: '#000000',
		eraserSelected: false,
	})

	let brushSizePx = computed(() => Math.pow(2.0, brushConfig.sizeFactor))

	let dpi = 150
	let sketch = new Sketch(11 * dpi, 8.5 * dpi)
	let currentLayer = ref(sketch.layers[0])

	return {
		brushConfig,
		brushSizePx,

		sketch,
		currentLayer,
	}
})

export const useLocalStore = defineStore('local', () => {
	let drawingConfig = reactive({
		smoothing: 5,
		shapeClosingDistance: 16,
		touchCalibrationMode: TouchCalibrationMode.Stylus,
	})

	let fingerCalibration = reactive({
		offsetY: -16,
		releaseTimeMs: 0,
	})

	let stylusCalibration = reactive({
		offsetY: 0,
		releaseTimeMs: 100,
	})

	return {
		drawingConfig,
		fingerCalibration,
		stylusCalibration,
	}
})
