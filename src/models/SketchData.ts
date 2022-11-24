import { LayerData } from './LayerData'

export class SketchData {
	public width: number
	public height: number
	public layers: LayerData[] = []

	constructor(width: number, height: number) {
		this.width = width
		this.height = height

		this.addLayer()
	}

	public addLayer() {
		this.layers.push(new LayerData(this))
	}
}
