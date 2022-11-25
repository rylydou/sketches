<script setup lang="ts">

import { ref } from 'vue'

import { useStore } from './stores/store'

import Bar from './components/Bar.vue'
import BarItem from './components/BarItem.vue'
import BarSpinButton from './components/BarSpinButton.vue'
import Canvas from './views/sketch/Canvas.vue'

import HomeIcon from './components/icons/HomeIcon.vue'
import EditIcon from './components/icons/EditIcon.vue'
import TuneIcon from './components/icons/TuneIcon.vue'
import InventoryIcon from './components/icons/InventoryIcon.vue'
import PrevIcon from './components/icons/PrevIcon.vue'
import NextIcon from './components/icons/NextIcon.vue'
import TrashIcon from './components/icons/TrashIcon.vue'
import LayersIcon from './components/icons/LayersIcon.vue'
import UndoIcon from './components/icons/UndoIcon.vue'
import RedoIcon from './components/icons/RedoIcon.vue'
import ArrowIcon from './components/icons/ArrowIcon.vue'
import ColorIcon from './components/icons/ColorIcon.vue'
import EraserIcon from './components/icons/EraserIcon.vue'

function setSize(val: number) {
	useStore().brushConfig.size = val
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
				<BarItem style="background-color: #8aae00; color: white">
					<ColorIcon />
				</BarItem>
				<BarItem>
					<EditIcon />
				</BarItem>
				<BarItem>
					<EraserIcon />
				</BarItem>
			</template>

			<template #middle>
				<BarSpinButton @change="setSize" :min="-4" :max="7" />
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

	background-color: hsla(200, 20%, 98%, 1.0);
	background-color: hsla(30, 25%, 98%, 1.0);
	/* background-color: hsla(0, 0%, 98%, 1.0); */
	background-color: white;
	/* background-image: url("data:image/svg+xml,<svg id='patternId' width='100%' height='100%' xmlns='http://www.w3.org/2000/svg'><defs><pattern id='a' patternUnits='userSpaceOnUse' width='30' height='30' patternTransform='scale(1) rotate(0)'><rect x='0' y='0' width='100%' height='100%' fill='hsla(0,0%,100%,1)'/><path d='M 10,-2.55e-7 V 20 Z M -1.1677362e-8,10 H 20 Z' transform='translate(5,0)' stroke-width='0.5' stroke='hsla(0, 0%, 90%, 1)' fill='none'/></pattern></defs><rect width='800%' height='800%' transform='translate(0,0)' fill='url(%23a)'/></svg>"); */

	/* background-image: url("data:image/svg+xml,<svg id='patternId' width='100%' height='100%' xmlns='http://www.w3.org/2000/svg'><defs><pattern id='a' patternUnits='userSpaceOnUse' width='40' height='40' patternTransform='scale(1) rotate(0)'><rect x='0' y='0' width='100%' height='100%' fill='hsla(0,0%,98%,1)'/><path d='M10 15a5 5 0 110-10 5 5 0 010 10z' transform='translate(10,0)' stroke-width='3.5' stroke='hsla(0,0%,93%,1)' fill='none'/></pattern></defs><rect width='800%' height='800%' transform='translate(20,0)' fill='url(%23a)'/></svg>"); */

	/* background-image: url("data:image/svg+xml,<svg id='patternId' width='100%' height='100%' xmlns='http://www.w3.org/2000/svg'><defs><pattern id='a' patternUnits='userSpaceOnUse' width='30' height='30' patternTransform='scale(1) rotate(89)'><rect x='0' y='0' width='100%' height='100%' fill='hsla(0,0%,98%,1)'/><path d='M3.25 10h13.5M10 3.25v13.5' transform='translate(5,0)' stroke-linecap='round' stroke-width='2.5' stroke='hsla(0,0%,93%,1)' fill='none'/></pattern></defs><rect width='800%' height='800%' transform='translate(0,0)' fill='url(%23a)'/></svg>"); */

	/* background-image: url("data:image/svg+xml,<svg id='patternId' width='100%' height='100%' xmlns='http://www.w3.org/2000/svg'><defs><pattern id='a' patternUnits='userSpaceOnUse' width='32' height='32' patternTransform='scale(1) rotate(0)'><rect x='0' y='0' width='100%' height='100%' fill='hsla(0,0%,98%,1)'/><path d='M40 16h-6m-4 0h-6m8 8v-6m0-4V8M8 16H2m-4 0h-6m8 8v-6m0-4V8'  stroke-linejoin='round' stroke-linecap='round' stroke-width='4' stroke='hsla(0,0%,94%,1)' fil='none'/><path d='M16-8v6m0 4v6m8-8h-6m-4 0H8m8 24v6m0 4v6m8-8h-6m-4 0H8'  stroke-linejoin='round' stroke-linecap='round' stroke-width='4' stroke='hsla(0,0%,93%,1)' fill='none'/></pattern></defs><rect width='800%' height='800%' transform='translate(0,0)' fill='url(%23a)'/></svg>"); */

	/* background-image: url("data:image/svg+xml,<svg id='patternId' width='100%' height='100%' xmlns='http://www.w3.org/2000/svg'><defs><pattern id='a' patternUnits='userSpaceOnUse' width='40' height='40' patternTransform='scale(2) rotate(175)'><rect x='0' y='0' width='100%' height='100%' fill='hsla(240,6.7%,17.6%,1)'/><path d='M27.26 5.415c-.55 0-.9.55-.65 1l2.45 4.75c.2.5.85.5 1.15.1l3.15-4.5c.3-.4 0-1.05-.55-1.1zM10.689 8.068c-.406-.051-.822.31-.778.748l.5 5.3c.05.5.6.8 1.05.5l4.55-3.05c.45-.3.4-.95-.05-1.15l-5.1-2.3a.605.605 0 0 0-.172-.048zM2.406 24.584a.635.635 0 0 0-.345.081l-4.75 2.4c-.45.2-.5.85-.1 1.15l4.45 3.15c.4.3 1 0 1.1-.5l.3-5.55c0-.412-.31-.712-.655-.73zm40 0a.635.635 0 0 0-.345.081l-4.75 2.4c-.45.2-.5.85-.1 1.15l4.45 3.15c.4.3 1 0 1.1-.5l.3-5.55c0-.412-.31-.712-.655-.73zm-22.17 3.108a.744.744 0 0 0-.675.723l.4 5.55c.05.5.6.8 1.05.5l4.45-2.95c.45-.25.4-.9-.05-1.15l-4.8-2.6a.702.702 0 0 0-.376-.073z'  stroke-width='1' stroke='none' fill='hsla(47,80.9%,61%,1)'/></pattern></defs><rect width='800%' height='800%' transform='translate(0,0)' fill='url(%23a)'/></svg>"); */

	/* background-image: url("data:image/svg+xml,<svg id='patternId' width='100%' height='100%' xmlns='http://www.w3.org/2000/svg'><defs><pattern id='a' patternUnits='userSpaceOnUse' width='20' height='20' patternTransform='scale(2) rotate(0)'><rect x='0' y='0' width='100%' height='100%' fill='hsla(0,0%,100%,1)'/><path d='M0 0h10v10H0z'  stroke-width='1' stroke='none' fill='hsla(0,0%,96%,1)'/><path d='M10 10h10v10H10z'  stroke-width='1' stroke='none' fill='hsla(0,0%,96%,1)'/></pattern></defs><rect width='800%' height='800%' transform='translate(0,0)' fill='url(%23a)'/></svg>") */
}

.pages {
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-content: center;
	gap: 24px;
	padding: 16px 0;
	/* flex-grow: 1; */
	overflow: hidden;
}
</style>
