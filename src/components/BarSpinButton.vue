<script setup lang="ts">
import PlusIcon from './../components/icons/PlusIcon.vue'
import MinusIcon from './../components/icons/MinusIcon.vue'

import { ref } from '@vue/reactivity'

var ref_value = ref<HTMLDivElement>()

var value = ref(1)

const props = defineProps<{
	max?: number,
	min?: number,
}>()

const emits = defineEmits<{
	(e: 'change', val: number): void
}>()

function inc() {
	if (value.value >= orDefault(props.max, Infinity)) return

	value.value++
	emits('change', value.value)
}

function dec() {
	if (value.value <= orDefault(props.min, -Infinity)) return

	value.value--
	emits('change', value.value)
}

function orDefault(value: any | undefined, def: any): any {
	if (value == undefined)
		return def
	return value
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
	value.value = Math.min(Math.max(v, orDefault(props.min, -Infinity)), orDefault(props.max, Infinity))
	emits('change', value.value)
}
</script>

<template>
	<div class="v-group" @touchstart="touchstart" @touchmove="touchmove">
		<div class="btn inc" @click="inc()">
			<slot name="inc">
				<PlusIcon />
			</slot>
		</div>

		<div ref="ref_value" class="btn value">{{
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

</style>
