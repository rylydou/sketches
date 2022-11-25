import { ref, computed, reactive } from 'vue'
import { defineStore } from 'pinia'

export const useStore = defineStore('store', () => {
	var brushConfig = reactive({
		size: 1.0,
		color: 'black',
		fingerOffsetY: -16.0,
		smoothing: 5.0,
		shapeClosingDistance: 16.0,
	})

	var brushSizePx = computed(() => Math.pow(2.0, brushConfig.size))

	return {
		brushConfig,
		brushSizePx,
	}
})
