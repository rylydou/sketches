import type { SketchData } from './SketchData'

export class LayerData {
	public data: Uint8ClampedArray

	public sketch: SketchData

	constructor(sketch: SketchData) {
		this.sketch = sketch
		this.data = new Uint8ClampedArray(sketch.width * sketch.height)
	}
}
