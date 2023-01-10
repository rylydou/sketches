<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { hideAllPoppers } from 'floating-vue'

import { useLocalStore, useSessionStore } from '@/store'
import { getDistance, getDistanceSqr } from '@/util'
import { SketchDriver } from '@/drivers/sketchdriver'
import { TouchCalibrationMode } from '@/types'
import type { Rect } from '@floating-ui/core'

var sessionStore = useSessionStore()
var localStore = useLocalStore()

let driver = new SketchDriver()
let ctx: CanvasRenderingContext2D

let ref_canvas = ref<HTMLCanvasElement>()
let canvas: HTMLCanvasElement

let observer: ResizeObserver
let rect: Rect = { x: 0, y: 0, width: 0, height: 0, }

onMounted(() => {
	if (ref_canvas.value == null) {
		console.error('error getting canvas')
		return
	}
	canvas = ref_canvas.value
	ctx = canvas.getContext('2d') as CanvasRenderingContext2D
	ctx.imageSmoothingEnabled = true
	ctx.imageSmoothingQuality = 'high'

	observer = new ResizeObserver(() => {
		canvas.width = canvas.offsetWidth
		canvas.height = canvas.offsetHeight

		driver.redraw()
	})
	observer.observe(canvas)

	driver.onRedraw = () => {
		ctx.clearRect(0, 0, canvas.width, canvas.height)

		let scale = Math.min((canvas.width - 16) / driver.canvas.width, (canvas.height - 16) / driver.canvas.height)

		let w = driver.canvas.width * scale
		let h = driver.canvas.height * scale
		let x = (canvas.width - w) / 2
		let y = (canvas.height - h) / 2

		rect.x = x
		rect.y = y
		rect.width = w
		rect.height = h

		ctx.drawImage(driver.canvas, x, y, w, h)

		if (!CanvasRenderingContext2D.prototype.roundRect) {
			CanvasRenderingContext2D.prototype.roundRect = function (x: number, y: number, w: number, h: number, r: number) {
				if (w < 2 * r) r = w / 2
				if (h < 2 * r) r = h / 2
				this.beginPath()
				this.moveTo(x + r, y)
				this.arcTo(x + w, y, x + w, y + h, r)
				this.arcTo(x + w, y + h, x, y + h, r)
				this.arcTo(x, y + h, x, y, r)
				this.arcTo(x, y, x + w, y, r)
				this.closePath()
				return this
			}
		}

		ctx.beginPath()
		ctx.strokeStyle = 'hsl(0 0% 80% / 1.0)'
		ctx.lineWidth = 0.5
		ctx.roundRect(x, y, w, h, 12)
		ctx.stroke()
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
	let bounds = canvas.getBoundingClientRect()
	let ratio = sessionStore.sketch.width / rect.width
	let pos = x - bounds.left - rect.x
	return pos * ratio
}

function transClientY(y: number): number {
	let bounds = canvas.getBoundingClientRect()
	let ratio = sessionStore.sketch.height / rect.height
	let pos = y - bounds.top - rect.y
	return pos * ratio
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
	<canvas ref="ref_canvas" class="canvas" @contextmenu="(ev) => ev.preventDefault()"
		@touchstart="touchstart" @touchmove="touchmove" @touchend="touchend" @mousedown="mousedown" />
</template>

<style scoped>
.canvas {
	width: 100%;
	height: 100%;
	cursor: crosshair;

	image-rendering: optimizeQuality;
}
</style>
