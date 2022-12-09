<script setup lang="ts">

import { ref } from 'vue'
import { Dropdown, hideAllPoppers, } from 'floating-vue'

import { getContrastColor } from '@/util'
import { useSessionStore } from '@/store'

import Bar from '@/components/Bar.vue'
import Button from '@/components/Button.vue'
import BarSpinButton from '@/components/BarSpinButton.vue'
import Canvas from '@/views/sketch/Canvas.vue'
import ColorPalette from '@/views/sketch/ColorPalette.vue'
import DrawingConfigMenu from '@/views/sketch/DrawingConfigMenu.vue'

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
import BugIcon from './components/icons/BugIcon.vue'
import LayersMenu from './views/sketch/LayersMenu.vue'

var sessionStore = useSessionStore()

function closePopoversWithDelay(delayMs: number) {
	setTimeout(() => hideAllPoppers(), delayMs)
}

</script>

<template>
	<div class="app" @contextmenu="(ev) => ev.preventDefault()">
		<Bar>
			<template #start>
				<Button>
					<HomeIcon />
				</Button>
				<Button>
					<InventoryIcon />
				</Button>
			</template>

			<template #middle>
				<Dropdown placement="left" :offset-distance="16">
					<Button style="gap: 4px">
						<LayersIcon />
						{{ sessionStore.currentLayerLabel
						}}
					</Button>
					<template #popper>
						<LayersMenu />
					</template>
				</Dropdown>
			</template>

			<template #end>
				<Button style="background-color: #ff02; color: #ea0;">
					<BugIcon />
				</Button>

				<Dropdown placement="left" :offset-distance="16">
					<Button>
						<TuneIcon />
					</Button>

					<template #popper>
						<DrawingConfigMenu />
					</template>
				</Dropdown>
			</template>
		</Bar>

		<div class="pages">
			<div class="overlay">
				<span v-if="!sessionStore.currentLayer">There is no layer selected</span>
				<span v-if="sessionStore.currentLayer?.isHidden">This layer is hidden</span>
			</div>

			<Canvas />
		</div>

		<Bar>
			<template #start>
			</template>

			<template #middle>
				<SwapIconButton class="spin" v-model="sessionStore.brushConfig.eraserSelected">
					<template #off>
						<EditIcon />
					</template>
					<template #on>
						<EraserIcon />
					</template>
				</SwapIconButton>

				<BarSpinButton v-model="sessionStore.brushConfig.sizeFactor" :min="0" :max="9">
					<template #inc>
						<UpIcon />
					</template>
					<template #dec>
						<DownIcon />
					</template>
				</BarSpinButton>

				<Dropdown placement="left" :offset-distance="16">
					<Button class="solid"
						:style="{ backgroundColor: sessionStore.brushConfig.color, color: getContrastColor(sessionStore.brushConfig.color, true), }">
						<ColorIcon style="" />
					</Button>

					<template #popper>
						<ColorPalette @picked="closePopoversWithDelay(500)" />
					</template>
				</Dropdown>
			</template>}

			<template #end>
				<div class="v-group">
					<Button>
						<UndoIcon />
					</Button>
					<Button>
						<RedoIcon />
					</Button>
				</div>
			</template>
		</Bar>

	</div>
</template>

<style lang="scss" scoped>
.app {
	display: flex;
	flex-direction: row;
	width: 100vw;
	height: 100vh;

	background-color: white;
}

.pages {
	position: relative;
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-content: center;
	flex-grow: 1;
	overflow: scroll;
}

.overlay {
	pointer-events: none;
	position: absolute;
	top: 50%;
	translate: 0 -50%;

	padding: 12px;
	border-radius: 12px;
	box-shadow: 0 0 0 2px hsl(0 0% 90% / 1.0);

	background-color: white;
	// background-color: #ffca3a;

	&:empty {
		display: none;
	}
}
</style>
