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
</script>

<template>
	<div class="v-group">
		<div class="btn inc" @click="inc()">
			<slot name="inc">
				<PlusIcon />
			</slot>
		</div>

		<div ref="ref_value" class="btn value">{{ value }}</div>

		<div class="btn dec" @click="dec()">
			<slot name="dec">
				<MinusIcon />
			</slot>
		</div>
	</div>
</template>

<style scoped>
/* .bar-spin-btn {
	display: flex;
	flex-direction: column;
	align-items: stretch;
	border-radius: 24px;
} */

/* .btn {
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-content: center;
	padding: 12px;
	font-weight: bold;
	transition: background-color 1000ms;
}

.btn.inc {
	border-radius: 12px 12px 0 0;
}

.btn.dec {
	border-radius: 0 0 12px 12px;
} */
</style>
