<script setup lang="ts">

import { ref } from 'vue'

import { getContrastColor } from '@/util'
import { useSessionStore } from '@/store'

import Bar from '@/components/Bar.vue'
import BarItem from '@/components/BarItem.vue'
import BarSpinButton from '@/components/BarSpinButton.vue'
import Canvas from '@/views/sketch/Canvas.vue'
import ColorPalette from '@/views/sketch/ColorPalette.vue'
import DrawingConfigMenu from '@/views/sketch/DrawingConfigMenu.vue'

import { Dropdown, hideAllPoppers, } from 'floating-vue'

import HomeIcon from '@/components/icons/HomeIcon.vue'
import EditIcon from '@/components/icons/EditIcon.vue'
import TuneIcon from '@/components/icons/TuneIcon.vue'
import InventoryIcon from '@/components/icons/InventoryIcon.vue'
import PrevIcon from '@/components/icons/PrevIcon.vue'
import NextIcon from '@/components/icons/NextIcon.vue'
import TrashIcon from '@/components/icons/TrashIcon.vue'
import LayersIcon from '@/components/icons/LayersIcon.vue'
import UndoIcon from '@/components/icons/UndoIcon.vue'
import RedoIcon from '@/components/icons/RedoIcon.vue'
import ArrowIcon from '@/components/icons/ArrowIcon.vue'
import ColorIcon from '@/components/icons/ColorIcon.vue'
import EraserIcon from '@/components/icons/EraserIcon.vue'
import SwapIconButton from './components/SwapIconButton.vue'
import UpIcon from './components/icons/UpIcon.vue'
import DownIcon from './components/icons/DownIcon.vue'

var store = useSessionStore()

function setSize(sizeFactor: number) {
	store.brushConfig.sizeFactor = sizeFactor
}

var eraser = ref(false)

function closePopoversWithDelay(delayMs: number) {
	setTimeout(() => hideAllPoppers(), delayMs)
}

</script>

<template>
	<div class="app">
		<Bar>
			<template #start>
				<BarItem>
					<HomeIcon />
				</BarItem>
				<BarItem>
					<InventoryIcon />
				</BarItem>
			</template>

			<template #middle>
				<BarItem>
					<LayersIcon />
				</BarItem>
			</template>

			<template #end>
				<Dropdown placement="left" :offset-distance="16">
					<BarItem>
						<TuneIcon />
					</BarItem>

					<template #popper>
						<DrawingConfigMenu />
					</template>
				</Dropdown>
			</template>
		</Bar>

		<div class="pages">
			<Canvas />
		</div>

		<Bar>
			<template #start>
			</template>

			<template #middle>
				<SwapIconButton v-model="eraser">
					<template #off>
						<EditIcon />
					</template>
					<template #on>
						<EraserIcon />
					</template>
				</SwapIconButton>

				<BarSpinButton @change="setSize" :min="0" :max="9">
					<template #inc>
						<UpIcon />
					</template>
					<template #dec>
						<DownIcon />
					</template>
				</BarSpinButton>

				<Dropdown placement="left" :offset-distance="16">
					<BarItem class="solid"
						:style="{ backgroundColor: store.brushConfig.color, color: getContrastColor(store.brushConfig.color, true), }">
						<ColorIcon style="" />
					</BarItem>

					<template #popper>
						<ColorPalette @picked="closePopoversWithDelay(200)" />
					</template>
				</Dropdown>
			</template>}

			<template #end>
				<div class="v-group">
					<BarItem>
						<UndoIcon />
					</BarItem>
					<BarItem>
						<RedoIcon />
					</BarItem>
				</div>
			</template>
		</Bar>

	</div>
</template>

<style scoped>
.app {
	display: flex;
	flex-direction: row;
	width: 100vw;
	height: 100vh;

	background-color: white;
}

.pages {
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-content: center;
	gap: 24px;
	padding: 16px 0;
	flex-grow: 1;
	overflow: scroll;
}
</style>
