<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { hideAllPoppers } from 'floating-vue'

import { useLocalStore, useSessionStore } from '@/store'
import { getDistance, getDistanceSqr } from '@/util'
import { SketchDriver } from '@/drivers/sketchdriver'
import { TouchCalibrationMode } from '@/types'

var sessionStore = useSessionStore()
var localStore = useLocalStore()

let driver: SketchDriver

let ref_canvas = ref<HTMLCanvasElement>()
let canvas: HTMLCanvasElement

onMounted(() => {
	if (ref_canvas.value == null) {
		console.error('error getting canvas')
		return
	}
	canvas = ref_canvas.value

	driver = new SketchDriver(canvas)
	driver.redraw()

	document.addEventListener('mousemove', mousemove)
	document.addEventListener('mouseup', mouseup)
	watch(sessionStore.sketch.layers, () => {
		console.log('redrawing form layers list changing')

		driver.redraw()
	})
})

function touchstart(clientX: number, clientY: number) {
	hideAllPoppers()

	let x = transClientX(clientX)
	let y = transClientY(clientY)

	if (localStore.drawingConfig.touchCalibrationMode == TouchCalibrationMode.Stylus) {
		y += localStore.stylusCalibration.offsetY
	}
	else {
		y += localStore.fingerCalibration.offsetY
	}

	driver.touchStart(x, y)
}

function touchmove(clientX: number, clientY: number) {
	let x = transClientX(clientX)
	let y = transClientY(clientY)

	if (localStore.drawingConfig.touchCalibrationMode == TouchCalibrationMode.Stylus) {
		y += localStore.stylusCalibration.offsetY
	}
	else {
		y += localStore.fingerCalibration.offsetY
	}

	driver.touchMove(x, y)
}

function touchend() {
	driver.touchEnd()
}

function transClientX(x: number): number {
	return (x - canvas.offsetLeft) / (canvas.clientWidth / canvas.width)
}

function transClientY(y: number): number {
	return (y - canvas.offsetTop) / (canvas.clientHeight / canvas.height)
}

let mouseX = 0.0
let mouseY = 0.0
let mouseDown = false
function mousedown(e: MouseEvent) {

	driver.touchStart(transClientX(mouseX), transClientY(mouseY))
	mouseDown = true
}

function mouseup(e: MouseEvent) {
	driver.touchEnd()
	mouseDown = false
}

function mousemove(e: MouseEvent) {
	mouseX = e.clientX
	mouseY = e.clientY

	if (mouseDown) {
		driver.touchMove(transClientX(mouseX), transClientY(mouseY))
	}
}
</script>

<template>
	<canvas ref="ref_canvas" class="canvas" :width="sessionStore.sketch.width"
		:height="sessionStore.sketch.height" @contextmenu="(ev) => ev.preventDefault()"
		@touchstart="(e) => touchstart(e.touches.item(0)!.clientX, e.touches.item(0)!.clientY)"
		@touchmove="(e) => touchmove(e.touches.item(0)!.clientX, e.touches.item(0)!.clientY)"
		@touchend="touchend()" @mousedown="mousedown" />
</template>

<style scoped>
.canvas {
	cursor: crosshair;

	aspect-ratio: 11 / 8.5;
	/* max-width: 100%; */
	/* max-height: 100%; */
	background-color: white;
	image-rendering: optimizeQuality;

	border-radius: 6px;
	box-shadow: 0 0 0 2px hsla(0, 0%, 90%, 1.0);
}
</style>
