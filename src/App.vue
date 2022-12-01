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
	<div class="app">
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
						{{ sessionStore.sketch.layers.length -
								sessionStore.sketch.layers.indexOf(sessionStore.currentLayer)
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
