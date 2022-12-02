<script setup lang="ts">
import { ref } from 'vue'

import NoneIcon from './icons/NoneIcon.vue'

let props = defineEmits<{
	(e: 'press'): void
}>()

let isOpen = ref(false)

function click(e: MouseEvent) {
	if (isOpen.value) {
		isOpen.value = false
		props('press')
	}
	else {
		isOpen.value = true
	}
}

function mouseleave(ev: PointerEvent) {
	setTimeout(() => isOpen.value = false, 50)
}

</script>

<template>
	<div role="button" :class="{ btn: true, solid: true, open: isOpen }" @click="click"
		@pointerleave="mouseleave">
		<slot>
			<NoneIcon style="color: red; outline: dashed 1px black; outline-offset: 2px;" />
		</slot>
	</div>
</template>

<style lang="scss" scoped>
@keyframes shake {
	0% {
		transform: translate(1px, 1px) rotate(0deg);
	}

	10% {
		transform: translate(-1px, -2px) rotate(-1deg);
	}

	20% {
		transform: translate(-3px, 0px) rotate(1deg);
	}

	30% {
		transform: translate(3px, 2px) rotate(0deg);
	}

	40% {
		transform: translate(1px, -1px) rotate(1deg);
	}

	50% {
		transform: translate(-1px, 2px) rotate(-1deg);
	}

	60% {
		transform: translate(-3px, 1px) rotate(0deg);
	}

	70% {
		transform: translate(3px, 1px) rotate(-1deg);
	}

	80% {
		transform: translate(-1px, -1px) rotate(1deg);
	}

	90% {
		transform: translate(1px, 2px) rotate(0deg);
	}

	100% {
		transform: translate(1px, -2px) rotate(-1deg);
	}
}

.btn {
	transition: color 200ms, background-color 200ms;

	&.open {
		background-color: #ff595e20;
		color: #ff595e;
		transition: color 0ms, background-color 0ms;
		box-shadow: inset 0 0 0 2px #ff595e;
		animation: shake 200ms;
	}
}
</style>
