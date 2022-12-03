import { ref, computed, reactive, watch, type Ref } from 'vue'
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
	let sketch = reactive(new Sketch(11 * dpi, 8.5 * dpi))
	let currentLayer = ref<SketchLayer | null>(sketch.layers[0])

	let currentLayerLabel = computed<string>(() => {
		if (currentLayer.value == null) return ''
		return (sketch.layers.length - sketch.layers.indexOf(currentLayer.value!)).toString()
	})

	watch(sketch.layers, () => {
		if (currentLayer.value != null) {
			if (sketch.layers.indexOf(currentLayer.value) < 0) {
				if (sketch.layers.length == 0) {
					console.error('no layers in sketch')
				}
				currentLayer.value = sketch.layers[0]
			}
		}
	})

	return {
		brushConfig,
		brushSizePx,

		sketch,
		currentLayer,
		currentLayerLabel,
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
