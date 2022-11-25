<script setup lang="ts">
import { ref, onMounted } from 'vue'

import { useStore } from '@/stores/store'
import { getDistanceSqr } from '../../util'

let ref_canvas = ref<HTMLCanvasElement>()
let canvas: HTMLCanvasElement
let imageData: ImageData
let ctx: CanvasRenderingContext2D
let offscreen: OffscreenCanvas

let start_x = NaN
let start_y = NaN

let last_x = NaN
let last_y = NaN

var last_cx = NaN
var last_cy = NaN

let distanceSqr = NaN

let drawPath: Path2D

onMounted(() => {
	// offscreen = new OffscreenCanvas()

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
	console.log('load')
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

	let isNearLast = getDistanceSqr(last_x, last_y, x, y) <= 5 * 5
	let isNearStart = getDistanceSqr(start_x, start_y, x, y) <= 16 * 16

	ctx.putImageData(imageData, 0, 0)

	ctx.lineWidth = useStore().brushSizePx
	ctx.strokeStyle = useStore().brushConfig.color
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
}

function touchend() {
	ctx.putImageData(imageData, 0, 0)

	let isNearStart = getDistanceSqr(start_x, start_y, last_x, last_y) <= 16.0 * 16.0

	if (distanceSqr <= 1.0) {
		ctx.fillStyle = 'black'
		let size = useStore().brushSizePx / 2.0
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
		@touchend="touchend()">

	</canvas>
</template>

<style scoped>
.canvas {
	/* max-width: 100%; */
	/* max-height: 100%; */
	background-color: white;
	image-rendering: optimizeQuality;

	border-radius: 12px;
	box-shadow: 0 0 0 2px hsla(0, 0%, 90%, 1.0);
}
</style>
