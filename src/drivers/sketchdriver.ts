import type { Sketch } from '@/models/Sketch'
import { useLocalStore, useSessionStore } from '@/store'
import vec2 from '@/vecs/vec2'
import { assert } from '@vue/compiler-core'
import { hideAllPoppers } from 'floating-vue'
import { computed } from 'vue'

export class SketchDriver {
	public readonly canvas: HTMLCanvasElement
	public readonly ctx: CanvasRenderingContext2D

	private get sketch() {
		return this.sessionStore.sketch
	}

	private sessionStore = useSessionStore()

	constructor(canvas: HTMLCanvasElement) {
		this.canvas = canvas
		this.ctx = canvas.getContext('2d') as CanvasRenderingContext2D
		assert(this.ctx != null)
		// this.sketch = sketch
	}

	private startedDrawing = false
	private baseImage: ImageData = null!
	private points: vec2[] = null!
	private path: Path2D = null!
	private lastTouch = vec2.zero
	private lastPoint = vec2.zero

	private setupPen(ctx: CanvasFillStrokeStyles & CanvasPathDrawingStyles & CanvasCompositing) {
		ctx.lineWidth = this.sessionStore.brushSizePx
		ctx.fillStyle = this.sessionStore.brushConfig.color
		ctx.strokeStyle = this.sessionStore.brushConfig.color
		ctx.globalCompositeOperation = this.sessionStore.brushConfig.eraserSelected ? 'destination-out' : 'source-over'
	}

	public touchStart(x: number, y: number) {
		hideAllPoppers()
		if (!this.sessionStore.currentLayer) {
			console.warn('Not drawing - No layer selected')
			return
		}
		this.startedDrawing = true

		let ctx = this.sessionStore.currentLayer.ctx
		this.ctx.arc(x, y, this.sessionStore.brushSizePx / 2, 0, Math.PI * 2)
		this.ctx.fill()
		this.setupPen(ctx)

		this.baseImage = ctx.getImageData(0, 0, this.sketch.width, this.sketch.height)
		// start new path
		// this.points = []
		// this.points.push(new vec2([x, y]))
		this.path = new Path2D()
		this.path.moveTo(x, y)
		this.lastPoint.xy = [x, y]
		this.lastTouch.xy = [x, y]

		this.redraw()
	}

	public touchMove(x: number, y: number) {
		if (!this.startedDrawing) return
		if (!this.sessionStore.currentLayer) return

		if (vec2.distance(this.lastPoint, new vec2([x, y])) < useLocalStore().drawingConfig.smoothing) {
			return
		}

		let ctx = this.sessionStore.currentLayer.ctx
		ctx.putImageData(this.baseImage, 0, 0)

		// this.points.push(new vec2([x, y]))
		// this.path.lineTo(x, y)
		// this.path.moveTo(this.lastPoint.x, this.lastPoint.y)
		let xc = (this.lastTouch.x + x) / 2.0
		let yc = (this.lastTouch.y + y) / 2.0
		this.path.quadraticCurveTo(this.lastTouch.x, this.lastTouch.y, xc, yc)
		ctx.stroke(this.path)

		this.lastPoint.xy = [xc, yc]
		this.lastTouch.xy = [x, y]

		this.redraw()
	}

	public touchEnd() {
		if (!this.startedDrawing) return
		this.startedDrawing = false
		if (!this.sessionStore.currentLayer) return

		let ctx = this.sessionStore.currentLayer.ctx

		ctx.putImageData(this.baseImage, 0, 0)
		let xc = (this.lastTouch.x + this.lastPoint.x) / 2.0
		let yc = (this.lastTouch.y + this.lastPoint.y) / 2.0
		this.path.quadraticCurveTo(this.lastPoint.x, this.lastPoint.y, xc, yc)
		ctx.stroke(this.path)

		this.redraw()
	}

	public redraw() {
		this.ctx.clearRect(0, 0, this.sketch.width, this.sketch.height)

		let spacing = this.sketch.width / 32
		this.ctx.fillStyle = 'hsl(0 0% 95%)'
		for (let y = spacing / 2; y < this.sketch.height; y += spacing) {
			for (let x = spacing / 2; x < this.sketch.width; x += spacing) {
				this.ctx.beginPath()
				this.ctx.arc(x, y, 4, 0, Math.PI * 2)
				this.ctx.fill()
			}
		}

		for (let index = this.sketch.layers.length - 1; index >= 0; index--) {
			const layer = this.sketch.layers[index]
			if (layer.isHidden) continue
			this.ctx.drawImage(layer.canvas, 0, 0)
		}

		// for (const layer of this.sketch.layers) {
		// this.ctx.drawImage(layer.canvas, 0, 0)
		// }
	}

	/*
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
	 */
}
