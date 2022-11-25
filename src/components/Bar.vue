<script setup lang="ts">

</script>

<template>
	<div class="bar">
		<div class="start">
			<slot name="start" />
		</div>
		<div class="middle">
			<slot name="middle" />
		</div>
		<div class="end">
			<slot name="end" />
		</div>
	</div>
</template>

<style scoped lang="scss">
.bar {
	position: relative;
	background-color: white;
	box-shadow: 0 0 0 2px hsla(0, 0%, 90%, 1.0);
	min-width: 64px;

	>* {
		position: absolute;
		display: flex;
		flex-direction: column;
		padding: 8px;
		gap: 8px;
		left: 0;
		right: 0;
	}

	>.start {
		top: 0;
		justify-content: start;
	}

	>.middle {
		top: 50%;
		translate: 0 -50%;
		justify-content: center;
	}

	>.end {
		bottom: 0;
		justify-content: end;
	}
}
</style>
