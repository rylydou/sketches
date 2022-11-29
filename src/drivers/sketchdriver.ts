import type { Sketch } from '@/models/Sketch'
import type vec2 from '@/vecs/vec2'

export class SketchDriver {
	public readonly canvas: HTMLCanvasElement
	public readonly sketch: Sketch

	constructor(canvas: HTMLCanvasElement, sketch: Sketch) {
		this.canvas = canvas
		this.sketch = sketch
	}

	private startedDrawing = false
	private baseImage: ImageData = null!
	private points: vec2[] = null!
	private path: Path2D = null!

	public touchStart(x: number, y: number) {
		this.startedDrawing = true

		this.baseImage = this.sketch.currentLayer!.ctx.getImageData(0, 0, this.sketch.width, this.sketch.height)
		// start new path
		// this.points = []
		// this.points.push(new vec2([x, y]))
		this.path = new Path2D()
		this.path.moveTo(x, y)
	}

	public touchMove(x: number, y: number) {
		// this.points.push(new vec2([x, y]))
		this.path.lineTo(x, y)
	}

	public touchEnd() {

	}
}
