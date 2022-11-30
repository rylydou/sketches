<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { hideAllPoppers } from 'floating-vue'

import { useLocalStore, useSessionStore } from '@/store'
import { getDistance, getDistanceSqr } from '@/util'
import { SketchDriver } from '@/drivers/sketchdriver'

var sessionStore = useSessionStore()
var localStore = useLocalStore()

let driver: SketchDriver

let ref_canvas = ref<HTMLCanvasElement>()
let canvas: HTMLCanvasElement
let imageData: ImageData
let ctx: CanvasRenderingContext2D
let start_x = NaN
let start_y = NaN

let last_x = NaN
let last_y = NaN

var last_cx = NaN
var last_cy = NaN

let distanceSqr = NaN

let drawPath: Path2D

onMounted(() => {
	if (ref_canvas.value == null) {
		console.error('error getting canvas')
		return
	}
	canvas = ref_canvas.value
	let tempCtx = canvas.getContext('2d')
	if (tempCtx == null) {
		console.error('error creating context')
		return
	}
	ctx = tempCtx
	ctx.imageSmoothingQuality = 'high'
	ctx.imageSmoothingEnabled = true

	driver = new SketchDriver(canvas)
	driver.redraw()

	document.addEventListener('mousemove', mousemove)
	document.addEventListener('mouseup', mouseup)
})

function touchstart(clientX: number, clientY: number) {
	hideAllPoppers()

	distanceSqr = 0.0

	let x = transClientX(clientX)
	let y = transClientY(clientY)

	driver.touchStart(x, y)
	return

	last_x = x
	last_y = y
	start_x = x
	start_y = y
	last_cx = x
	last_cy = y

	imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)

	drawPath = new Path2D()
	drawPath.moveTo(x, y)
}

function touchmove(clientX: number, clientY: number) {
	let x = transClientX(clientX)
	let y = transClientY(clientY)

	driver.touchMove(x, y)
	return

	let isNearLast = getDistance(last_x, last_y, x, y) <= localStore.drawingConfig.smoothing
	let isNearStart = getDistance(start_x, start_y, x, y) <= localStore.drawingConfig.shapeClosingDistance

	ctx.putImageData(imageData, 0, 0)

	ctx.lineWidth = sessionStore.brushSizePx
	ctx.strokeStyle = sessionStore.brushConfig.color
	ctx.globalCompositeOperation = sessionStore.brushConfig.eraserSelected ? 'destination-out' : 'source-over'

	if (isNearLast)
		ctx.stroke(drawPath)

	if (isNearStart) {
		ctx.beginPath()
		ctx.moveTo(x, y)
		let xc = (last_x + x) / 2.0
		let yc = (last_y + y) / 2.0
		// ctx.quadraticCurveTo(last_x, last_y, xc, yc)
		ctx.quadraticCurveTo(xc, yc, start_x, start_y)
		// ctx.quadraticCurveTo(last_cx, last_cy, start_x, start_y)
		// ctx.lineTo(start_x, start_y)
		ctx.stroke()
	}

	if (isNearLast) {
		ctx.beginPath()
		ctx.moveTo(last_cx, last_cy)
		let xc = (last_x + x) / 2.0
		let yc = (last_y + y) / 2.0
		// ctx.quadraticCurveTo(last_x, last_y, xc, yc)
		ctx.quadraticCurveTo(last_x, last_y, x, y)
		// ctx.lineTo(x, y)
		ctx.stroke()
	}
	else {
		let xc = (last_x + x) / 2.0
		let yc = (last_y + y) / 2.0
		last_cx = xc
		last_cy = yc
		drawPath.quadraticCurveTo(last_x, last_y, xc, yc)
		// drawPath.quadraticCurveTo(last_x, last_y, x, y)
		ctx.stroke(drawPath)

		distanceSqr += (x * x) + (y * y)

		last_x = x
		last_y = y
	}

	ctx.save()

	if (sessionStore.brushConfig.eraserSelected) {
		ctx.beginPath()
		ctx.lineWidth = 8
		ctx.strokeStyle = 'white'
		ctx.globalCompositeOperation = 'difference'
		ctx.arc(x, y, sessionStore.brushSizePx / 2 + 6, 0, 2 * Math.PI)
		ctx.stroke()
	}

	ctx.beginPath()
	ctx.lineWidth = 2
	ctx.strokeStyle = 'white'
	ctx.globalCompositeOperation = 'source-over'
	ctx.arc(x, y, sessionStore.brushSizePx / 2 + 2, 0, 2 * Math.PI)
	ctx.stroke()

	ctx.beginPath()
	ctx.lineWidth = 2
	ctx.strokeStyle = 'black'
	ctx.globalCompositeOperation = 'source-over'
	ctx.arc(x, y, sessionStore.brushSizePx / 2, 0, 2 * Math.PI)
	ctx.stroke()

	ctx.restore()
}

function touchend() {
	driver.touchEnd()
	return

	ctx.putImageData(imageData, 0, 0)

	let isNearStart = getDistance(start_x, start_y, last_x, last_y) <= localStore.drawingConfig.shapeClosingDistance

	if (distanceSqr <= 1.0) {
		ctx.fillStyle = sessionStore.brushConfig.color
		let size = sessionStore.brushSizePx / 2.0
		ctx.beginPath()
		ctx.arc(last_x, last_y, size, 0, Math.PI * 2)
		ctx.fill()
		return
	}

	if (isNearStart) {
		let xc = (last_x + start_x) / 2.0
		let yc = (last_y + start_y) / 2.0
		drawPath.quadraticCurveTo(last_x, last_y, xc, yc)
		drawPath.quadraticCurveTo(xc, yc, start_x, start_y)
		drawPath.closePath()
	}

	ctx.stroke(drawPath)

	let x = sessionStore.sketch.layers[0].ctx
	x.lineCap = 'round'
	x.lineJoin = 'round'
	x.lineWidth = sessionStore.brushSizePx
	x.strokeStyle = sessionStore.brushConfig.color
	x.globalCompositeOperation = sessionStore.brushConfig.eraserSelected ? 'destination-out' : 'source-over'
	x.stroke(drawPath)
}

function clear() {
	ctx.clearRect(0, 0, canvas.width, canvas.height)
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
		:height="sessionStore.sketch.height"
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

	border-radius: 12px;
	box-shadow: 0 0 0 2px hsla(0, 0%, 90%, 1.0);
}
</style>
