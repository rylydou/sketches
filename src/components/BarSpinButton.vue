<script setup lang="ts">
import PlusIcon from './../components/icons/PlusIcon.vue'
import MinusIcon from './../components/icons/MinusIcon.vue'

import { ref } from '@vue/reactivity'
import { computed } from 'vue'

var props = defineProps<{
	modelValue: number,

	max?: number,
	min?: number,
	step?: number,
}>()

var { max, min, step } = props

var emits = defineEmits<{
	(e: 'update:modelValue', value: number): void,
}>()

var holdValue = NaN

const value = computed({
	get() {
		return props.modelValue
	},
	set(value: number) {
		emits('update:modelValue', value)
	}
})

function clamp(value: number) {
	value = Math.min(value, max ?? Infinity)
	value = Math.max(value, min ?? -Infinity)
	return value
}

function inc() {
	if (value.value >= (max ?? Infinity)) return
	value.value = clamp(value.value + (props.step ?? 1))
}

function dec() {
	if (value.value <= (min ?? -Infinity)) return
	value.value = clamp(value.value - (props.step ?? 1))
}

var startY = NaN
var startValue = NaN
function touchstart(e: TouchEvent) {
	startValue = value.value
	startY = e.touches.item(0)!.clientY
}

function touchmove(e: TouchEvent) {
	let v = startValue + (startY - e.touches.item(0)!.clientY) / 200.0
	v = Math.round(v * 10.0) / 10.0
	value.value = clamp(v)
}

function hold() {
	if (isNaN(holdValue)) {
		holdValue = value.value
		return
	}

	var temp = value.value
	value.value = holdValue
	holdValue = temp
}
</script>

<template>
	<div class="v-group" @touchstart="touchstart" @touchmove="touchmove">
		<div class="btn inc" @click="inc()">
			<slot name="inc">
				<PlusIcon />
			</slot>
		</div>

		<div ref="ref_value" class="btn value" @click="hold()">{{
				value
		}}</div>

		<div class="btn dec" @click="dec()">
			<slot name="dec">
				<MinusIcon />
			</slot>
		</div>
	</div>
</template>

<style scoped>
.value {
	font-size: 24px;
}
</style>
