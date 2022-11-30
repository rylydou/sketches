import type { Sketch } from '@/models/Sketch'
import { useSessionStore } from '@/store'
import type vec2 from '@/vecs/vec2'
import { assert } from '@vue/compiler-core'
import { computed } from 'vue'

export class SketchDriver {
	public readonly canvas: HTMLCanvasElement
	public readonly ctx: CanvasRenderingContext2D

	// public readonly sketch: Sketch
	private get sketch() {
		return this.sessionStore.sketch
	}

	private sessionStore = useSessionStore()

	constructor(canvas: HTMLCanvasElement/* , sketch: Sketch */) {
		this.canvas = canvas
		this.ctx = canvas.getContext('2d') as CanvasRenderingContext2D
		assert(this.ctx != null)
		// this.sketch = sketch
	}

	private startedDrawing = false
	private baseImage: ImageData = null!
	private points: vec2[] = null!
	private path: Path2D = null!

	private setupPen(ctx: CanvasFillStrokeStyles & CanvasPathDrawingStyles & CanvasCompositing) {
		ctx.lineWidth = this.sessionStore.brushSizePx
		ctx.strokeStyle = this.sessionStore.brushConfig.color
		ctx.globalCompositeOperation = this.sessionStore.brushConfig.eraserSelected ? 'destination-out' : 'source-over'
	}

	public touchStart(x: number, y: number) {
		if (!this.sessionStore.currentLayer) {
			console.error('Not drawing - No layer selected')
			return
		}
		this.startedDrawing = true

		let ctx = this.sessionStore.currentLayer.ctx
		this.setupPen(ctx)

		this.baseImage = ctx.getImageData(0, 0, this.sketch.width, this.sketch.height)
		// start new path
		// this.points = []
		// this.points.push(new vec2([x, y]))
		this.path = new Path2D()
		this.path.moveTo(x, y)
		this.redraw()
	}

	public touchMove(x: number, y: number) {
		if (!this.startedDrawing) return

		let ctx = this.sessionStore.currentLayer.ctx
		ctx.putImageData(this.baseImage, 0, 0)

		// this.points.push(new vec2([x, y]))
		this.path.lineTo(x, y)
		ctx.stroke(this.path)
		this.redraw()
	}

	public touchEnd() {
		if (!this.startedDrawing) return

		this.startedDrawing = false
		this.redraw()
	}

	public redraw() {
		this.ctx.clearRect(0, 0, this.sketch.width, this.sketch.height)

		for (const layer of this.sketch.layers) {
			this.ctx.drawImage(layer.canvas, 0, 0)
		}
	}
}
