import { useStore } from './stores/store'

export function getDistanceSqr(x1: number, y1: number, x2: number, y2: number): number {
	let diffX = Math.abs(x1 - x2)
	let diffY = Math.abs(y1 - y2)
	return (diffX * diffX) + (diffY * diffY)
}

export function getDistance(x1: number, y1: number, x2: number, y2: number): number {
	return Math.sqrt(getDistanceSqr(x1, y1, x2, y2))
}

export function getBrushSize(): number {
	return Math.pow(2.0, useStore().brushConfig.size)
}

// export function getBrushSize(size: number): number {
// 	return Math.pow(2, size) / 2.0
// }
