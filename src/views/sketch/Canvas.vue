<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { hideAllPoppers } from 'floating-vue'

import { useLocalStore, useSessionStore } from '@/store'
import { getDistance, getDistanceSqr } from '@/util'

var sessionStore = useSessionStore()
var localStore = useLocalStore()

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
	window.onkeydown = (ev) => {
		if (ev.key == 'r')
			clear()
	}

	loaded()

	let dpi = 150.0
	canvas.width = 11.0 * dpi
	canvas.height = 8.5 * dpi
	console.log({ width: canvas.width, height: canvas.height })
})

function loaded() {
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
}

function touchstart(clientX: number, clientY: number) {
	hideAllPoppers()

	distanceSqr = 0.0

	let x = transClientX(clientX)
	let y = transClientY(clientY)
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

	let isNearLast = getDistance(last_x, last_y, x, y) <= localStore.drawingConfig.smoothing
	let isNearStart = getDistance(start_x, start_y, x, y) <= localStore.drawingConfig.shapeClosingDistance

	ctx.putImageData(imageData, 0, 0)

	ctx.lineWidth = sessionStore.brushSizePx
	ctx.strokeStyle = sessionStore.brushConfig.color
	if (sessionStore.brushConfig.eraserSelected) {
		ctx.globalCompositeOperation = 'destination-out'
	}
	else {
		ctx.globalCompositeOperation = 'source-over'
	}
	ctx.lineCap = 'round'
	ctx.lineJoin = 'round'
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
}

function clear() {
	ctx.clearRect(0, 0, canvas.width, canvas.height)
}

function transClientX(x: number): number {
	return (x - canvas.offsetLeft) / (canvas.clientWidth / canvas.width)
}

function transClientY(y: number): number {
	return (y - canvas.offsetTop) / (canvas.clientHeight / canvas.height) - 18
}
</script>

<template>
	<canvas ref="ref_canvas" class="canvas"
		@touchstart="(e) => touchstart(e.touches.item(0)!.clientX, e.touches.item(0)!.clientY)"
		@touchmove="(e) => touchmove(e.touches.item(0)!.clientX, e.touches.item(0)!.clientY)"
		@touchend="touchend()" />
</template>

<style scoped>
.canvas {
	aspect-ratio: 11 / 8.5;
	/* max-width: 100%; */
	/* max-height: 100%; */
	background-color: white;
	image-rendering: optimizeQuality;

	border-radius: 12px;
	box-shadow: 0 0 0 2px hsla(0, 0%, 90%, 1.0);
}
</style>
