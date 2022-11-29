export class Sketch {
	public readonly width: number
	public readonly height: number

	public layers: SketchLayer[] = []

	constructor(width: number, height: number) {
		this.width = width
		this.height = height

		this.addLayer()
	}

	public addLayer(): SketchLayer {
		let layer = new SketchLayer(this)
		this.layers.unshift(layer)
		return layer
	}

	public removeLayer(layer: SketchLayer) {
		this.layers.splice(this.layers.indexOf(layer), 1)
	}
}

export class SketchLayer {
	public readonly sketch: Sketch

	public name: string
	public isHidden = false

	public readonly canvas: OffscreenCanvas
	public readonly ctx: OffscreenCanvasRenderingContext2D

	constructor(sketch: Sketch) {
		this.name = `Layer ${sketch.layers.length + 1}`
		this.sketch = sketch
		this.canvas = new OffscreenCanvas(sketch.width, sketch.height)
		this.ctx = this.canvas.getContext('2d') as OffscreenCanvasRenderingContext2D
	}
}
