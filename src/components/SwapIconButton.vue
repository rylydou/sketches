<script lang="ts" setup>
</script>

<template>
	<div class="btn">
		<slot name="off" class="off"></slot>
		<slot name="on" class="on"></slot>
	</div>
</template>

<style lang="scss" scoped>
@keyframes spin {
	from {
		rotate: 0turn,
	}

	to {
		rotate: 1turn;
	}
}

.btn:active {
	animation: spin 1000ms forwards;
}
</style>
