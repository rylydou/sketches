<script lang="ts" setup>
import { computed, ref } from 'vue'
import OffIcon from './icons/OffIcon.vue'
import OnIcon from './icons/OnIcon.vue'

var props = defineProps<{
	modelValue: boolean,
}>()

var emits = defineEmits<{
	(e: 'update:modelValue', value: boolean): void
}>()

var anim = ref(false)
let animTimeoutId: number

const value = computed({
	get() {
		return props.modelValue
	},
	set(value: boolean) {
		emits('update:modelValue', value)

		clearTimeout(animTimeoutId)
		anim.value = false
		setTimeout(() => { anim.value = true }, 10)
		animTimeoutId = setTimeout(() => { anim.value = false }, 1000)
	}
})

</script>

<template>
	<div :class="{ btn: true, swap: true, anim: anim, }" @click="value = !value">
		<span class="holder" style="width: 24px; height: 24px;">
			<slot v-if="!value" name="off" class="off">
				<OffIcon />
			</slot>
			<slot v-if="value" name="on" class="on">
				<OnIcon />
			</slot>
		</span>
	</div>
</template>

<style lang="scss" scoped>
@keyframes spin {
	from {
		rotate: 0turn;
		// filter: blur(4px);
		// opacity: 0;
	}

	50% {
		// filter: blur(0px);
		// opacity: 1;
	}

	to {
		scale: 1;
		rotate: 1turn;
	}
}

.btn.swap.anim>.holder {
	animation: spin 1000ms cubic-bezier(0.16, 1, 0.3, 1);
}
</style>
