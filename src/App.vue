<script setup lang="ts">

import { ref } from 'vue'

import { getContrastColor } from '@/util'
import { useSessionStore } from '@/stores/session'

import Bar from '@/components/Bar.vue'
import BarItem from '@/components/BarItem.vue'
import BarSpinButton from '@/components/BarSpinButton.vue'
import Canvas from '@/views/sketch/Canvas.vue'
import ColorPalette from '@/views/sketch/ColorPalette.vue'

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

var store = useSessionStore()

function setSize(val: number) {
	store.brushConfig.size = val
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
				<BarItem>
					<TuneIcon />
				</BarItem>
			</template>
		</Bar>

		<div class="pages">
			<Canvas />
			<!-- <Canvas /> -->
		</div>

		<Bar>
			<template #start>
			</template>

			<template #middle>
				<BarItem>
					<EditIcon />
				</BarItem>

				<BarSpinButton @change="setSize" :min="-4" :max="7" />

				<Dropdown placement="left" :offset-distance="16" :arrow="true">
					<BarItem class="solid"
						:style="{ backgroundColor: store.brushConfig.color, color: getContrastColor(store.brushConfig.color, true), }">
						<ColorIcon style="" />
					</BarItem>

					<template #popper>
						<ColorPalette @picked="hideAllPoppers()" />
					</template>
				</Dropdown>
			</template>

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
	/* filter: invert(100%); */

	display: flex;
	flex-direction: row;
	width: 100vw;
	height: 100vh;

	/* background-color: hsla(200, 20%, 98%, 1.0); */
	/* background-color: hsla(30, 25%, 98%, 1.0); */
	/* background-color: hsla(0, 0%, 98%, 1.0); */
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
