<script lang="ts" setup>
import { computed, nextTick, onMounted, ref } from 'vue'
import OffIcon from './icons/OffIcon.vue'
import OnIcon from './icons/OnIcon.vue'

let props = defineProps<{
	modelValue: boolean,
}>()

let emits = defineEmits<{
	(e: 'update:modelValue', value: boolean): void
}>()

let anim = ref(false)
let animTimeoutId: number
let ref_btn = ref<HTMLDivElement>()

const value = computed({
	get() {
		return props.modelValue
	},
	set(value: boolean) {
		emits('update:modelValue', value)

		// clearTimeout(animTimeoutId)
		if (anim.value == false) {
			anim.value = true
		}
		else {
			ref_btn.value?.addEventListener('animationcancel', (ev) => { anim.value = true }, { once: true })
			anim.value = false
		}
	}
})

onMounted(() => {
	ref_btn.value?.addEventListener('animationend', (ev) => { anim.value = false })
})

</script>

<template>
	<div :class="{ btn: true, swap: true, anim: anim, }" @click="value = !value" ref="ref_btn">
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
	}

	to {
		rotate: 1turn;
	}
}

@keyframes pop {
	from {
		scale: 1;
		visibility: hidden;
		opacity: 0;
	}

	1% {
		scale: 0;
		visibility: visible;
	}

	to {
		scale: 1;
		opacity: 1;
	}
}

.btn.swap.anim.spin>.holder {
	animation: spin 1000ms cubic-bezier(0.16, 1, 0.3, 1);
}

.btn.swap.anim.pop>.holder {
	// animation: pop 300ms cubic-bezier(0.34, 1.56, 0.64, 1);
	animation: pop 200ms;
}
</style>
