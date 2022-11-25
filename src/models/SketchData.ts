import LayerData from './LayerData'

export default class SketchData {
	public width: number
	public height: number
	public layers: LayerData[] = []

	constructor(width: number, height: number) {
		this.width = width
		this.height = height

		this.addLayer()
	}

	public addLayer(): LayerData {
		let layer = new LayerData(this)
		this.layers.push(layer)
		return layer
	}
}
