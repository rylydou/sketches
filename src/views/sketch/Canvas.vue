<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { hideAllPoppers } from 'floating-vue'

import { useLocalStore, useSessionStore } from '@/store'
import { getDistance, getDistanceSqr } from '@/util'
import { SketchDriver } from '@/drivers/sketchdriver'
import { TouchCalibrationMode } from '@/types'

var sessionStore = useSessionStore()
var localStore = useLocalStore()

let driver = new SketchDriver()
let ctx: CanvasRenderingContext2D

let ref_canvas = ref<HTMLCanvasElement>()
let canvas: HTMLCanvasElement

onMounted(() => {
	if (ref_canvas.value == null) {
		console.error('error getting canvas')
		return
	}
	canvas = ref_canvas.value
	ctx = canvas.getContext('2d') as CanvasRenderingContext2D
	ctx.imageSmoothingEnabled = true
	ctx.imageSmoothingQuality = 'high'

	driver.onRedraw = () => {
		ctx.clearRect(0, 0, canvas.width, canvas.height)
		ctx.drawImage(driver.canvas, 0, 0)
	}

	driver.redraw()

	document.addEventListener('mousemove', mousemove)
	document.addEventListener('mouseup', mouseup)
	watch(sessionStore.sketch.layers, () => {
		console.log('redrawing form layers list changing')

		driver.redraw()
	})
})

function touchstart(ev: TouchEvent) {
	hideAllPoppers()

	switch (ev.touches.length) {
		case 1:
			let touch = ev.touches.item(0)!
			let x = transClientX(touch.clientX)
			let y = transClientY(touch.clientY)

			if (localStore.drawingConfig.touchCalibrationMode == TouchCalibrationMode.Stylus) {
				y += localStore.stylusCalibration.offsetY
			}
			else {
				y += localStore.fingerCalibration.offsetY
			}

			driver.touchStart(x, y)
			break
		case 2:
			break
	}
}

function touchmove(ev: TouchEvent) {
	switch (ev.touches.length) {
		case 1:
			let touch = ev.touches.item(0)!
			let x = transClientX(touch.clientX)
			let y = transClientY(touch.clientY)

			if (localStore.drawingConfig.touchCalibrationMode == TouchCalibrationMode.Stylus) {
				y += localStore.stylusCalibration.offsetY
			}
			else {
				y += localStore.fingerCalibration.offsetY
			}

			driver.touchMove(x, y)
			break
		case 2:
			break
	}
}

function touchend() {
	driver.touchEnd()
}

function transClientX(x: number): number {
	let rect = canvas.getBoundingClientRect()
	return (x - rect.left) / (rect.width / canvas.width)
}

function transClientY(y: number): number {
	let rect = canvas.getBoundingClientRect()

	return (y - rect.top) / (rect.height / canvas.height)
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
	<canvas ref="ref_canvas" class="canvas"
		:width="ref_canvas?.parentElement?.getBoundingClientRect().width"
		:height="ref_canvas?.parentElement?.getBoundingClientRect().height"
		@contextmenu="(ev) => ev.preventDefault()" @touchstart="touchstart" @touchmove="touchmove"
		@touchend="touchend" @mousedown="mousedown" />
</template>

<style scoped>
.canvas {
	flex-grow: 1;
	cursor: crosshair;

	background-color: white;
	background-color: lightgreen;
	image-rendering: optimizeQuality;

	/* border-radius: 6px; */
	/* box-shadow: 0 0 0 2px hsla(0, 0%, 90%, 1.0); */
}
</style>
