<script setup lang="ts">
import { colors } from '@/constants'
import { useSessionStore } from '@/store'
import { isContrastColorBlack } from '@/util'
import { computed } from 'vue'

var store = useSessionStore()

var emits = defineEmits<{
	(e: 'picked', color: string): void
}>()
</script>

<template>
	<ul class="grid" role="radiogroup">
		<li v-for="color in colors" role="radio"
			:class="{ swatch: true, active: color == store.brushConfig.color, white_drop: !isContrastColorBlack(color) }"
			:style="{ color: color }" @click="store.brushConfig.color = color; emits('picked', color)">
		</li>
	</ul>

</template>

<style lang="scss" scoped>
.grid {
	display: grid;
	grid-template-columns: 48px 48px 48px;
	grid-auto-rows: 48px;
	gap: 16px;
	padding: 16px;
}

.swatch {
	cursor: pointer;
	position: relative;

	width: 48px;
	height: 52px;
	border-radius: 12px;

	background-color: currentColor;

	box-shadow:
		inset 0 -4px 0 0 hsl(0 0% 0% / 0.5),
		inset 0 0px 0 0 white;

	transition: box-shadow 200ms ease-out;
}

.swatch.active {
	cursor: default;
	box-shadow:
		inset 0 0px 0 0 hsl(0 0% 0% / 0.5),
		inset 0 4px 0 0 white;
}

.swatch::after {
	// https://www.mobilefish.com/services/base64/base64.php
	content: url("data:image/svg+xml,	%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg clip-path='url(%23clip0_5_2)'%3E%3Cmask id='mask0_5_2' style='mask-type:alpha' maskUnits='userSpaceOnUse' x='0' y='0' width='24' height='24'%3E%3Crect width='24' height='24' fill='%23D9D9D9' /%3E%3C/mask%3E%3Cg mask='url(%23mask0_5_2)'%3E%3Cpath d='M12.275 19C12.475 18.9833 12.646 18.9043 12.788 18.763C12.9293 18.621 13 18.45 13 18.25C13 18.0167 12.925 17.8293 12.775 17.688C12.625 17.546 12.4333 17.4833 12.2 17.5C11.5167 17.55 10.7917 17.3627 10.025 16.938C9.25833 16.5127 8.775 15.7417 8.575 14.625C8.54167 14.4417 8.454 14.2917 8.312 14.175C8.17067 14.0583 8.00833 14 7.825 14C7.59167 14 7.4 14.0873 7.25 14.262C7.1 14.4373 7.05 14.6417 7.1 14.875C7.38333 16.3917 8.05 17.475 9.1 18.125C10.15 18.775 11.2083 19.0667 12.275 19ZM12 22C9.71667 22 7.81267 21.2167 6.288 19.65C4.76267 18.0833 4 16.1333 4 13.8C4 12.1333 4.66267 10.321 5.988 8.363C7.31267 6.40433 9.31667 4.28333 12 2C14.6833 4.28333 16.6877 6.40433 18.013 8.363C19.3377 10.321 20 12.1333 20 13.8C20 16.1333 19.2373 18.0833 17.712 19.65C16.1873 21.2167 14.2833 22 12 22ZM12 20C13.7333 20 15.1667 19.4127 16.3 18.238C17.4333 17.0627 18 15.5833 18 13.8C18 12.5833 17.496 11.2083 16.488 9.675C15.4793 8.14167 13.9833 6.46667 12 4.65C10.0167 6.46667 8.521 8.14167 7.513 9.675C6.50433 11.2083 6 12.5833 6 13.8C6 15.5833 6.56667 17.0627 7.7 18.238C8.83333 19.4127 10.2667 20 12 20Z' fill='black' /%3E%3C/g%3E%3C/g%3E%3Cdefs%3E%3CclipPath id='clip0_5_2'%3E%3Crect width='24' height='24' fill='white' /%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E");

	position: absolute;

	top: 50%;
	left: 50%;

	width: 24px;
	height: 24px;

	opacity: 0;
	scale: 1.5;
	translate: -50% calc(-50% - 16px);

	transition: none;

	color: red;
}

.swatch.white_drop::after {
	filter: invert(1.0);
}

.swatch.active::after {
	opacity: 1;
	scale: 1;
	translate: -50% calc(-50% + 2px);

	transition: opacity 300ms, scale 300ms cubic-bezier(0.34, 1.56, 0.64, 1), translate 300ms cubic-bezier(0.34, 1.56, 0.64, 1);
}
</style>
