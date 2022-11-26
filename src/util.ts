import { useSessionStore } from '@/store'

export function getDistanceSqr(x1: number, y1: number, x2: number, y2: number): number {
	let diffX = Math.abs(x1 - x2)
	let diffY = Math.abs(y1 - y2)
	return (diffX * diffX) + (diffY * diffY)
}

export function getDistance(x1: number, y1: number, x2: number, y2: number): number {
	return Math.sqrt(getDistanceSqr(x1, y1, x2, y2))
}

export function getBrushSize(): number {
	return Math.pow(2.0, useSessionStore().brushConfig.sizeFactor)
}

export function isContrastColorBlack(hex: string) {
	if (hex.indexOf('#') === 0) {
		hex = hex.slice(1)
	}
	// convert 3-digit hex to 6-digits.
	if (hex.length === 3) {
		hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2]
	}
	if (hex.length !== 6) {
		throw new Error('Invalid HEX color. of ' + hex)
	}
	var r = parseInt(hex.slice(0, 2), 16),
		g = parseInt(hex.slice(2, 4), 16),
		b = parseInt(hex.slice(4, 6), 16)
	// https://stackoverflow.com/a/3943023/112731
	return (r * 0.299 + g * 0.587 + b * 0.114) > 186
}

export function getContrastColor(hex: string, bw: boolean = true) {
	if (hex.indexOf('#') === 0) {
		hex = hex.slice(1)
	}
	// convert 3-digit hex to 6-digits.
	if (hex.length === 3) {
		hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2]
	}
	if (hex.length !== 6) {
		throw new Error('Invalid HEX color. of ' + hex)
	}
	var r = parseInt(hex.slice(0, 2), 16),
		g = parseInt(hex.slice(2, 4), 16),
		b = parseInt(hex.slice(4, 6), 16)
	if (bw) {
		// https://stackoverflow.com/a/3943023/112731
		return (r * 0.299 + g * 0.587 + b * 0.114) > 186
			? '#000000'
			: '#FFFFFF'
	}
	// invert color components
	let rhex = (255 - r).toString(16)
	let ghex = (255 - g).toString(16)
	let bhex = (255 - b).toString(16)
	// pad each with zeros and return
	return "#" + padZero(rhex) + padZero(ghex) + padZero(bhex)
}

export function padZero(str: string, len: number | undefined = undefined) {
	len = len || 2
	var zeros = new Array(len).join('0')
	return (zeros + str).slice(-len)
}

// export function getBrushSize(size: number): number {
// 	return Math.pow(2, size) / 2.0
// }
