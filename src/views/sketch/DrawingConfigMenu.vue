<script lang="ts" setup>
import BarItem from '@/components/BarItem.vue'
import EditIcon from '@/components/icons/EditIcon.vue'


</script>

<template>
	<div class="menu">
		<div class="section">
			<div class="header">
				Touch calibration
			</div>
			<div class="content">
				<div class="h-group">
					<BarItem>
						<EditIcon />
						Stylus
					</BarItem>
					<BarItem>
						<EditIcon />
						Finger
					</BarItem>
				</div>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.menu {
	display: flex;
	flex-direction: column;
	padding: 12px;
	gap: 16px;
	width: 400px;
	height: 500px;
}

.section {
	display: flex;
	flex-direction: column;
	// padding: 12px;
	// border: solid 2px hsla(0 0% 90% / 1.0);
	// border-radius: 12px;

	>.header {
		display: flex;
		flex-direction: row;
		// justify-content: center;
		font-size: 16px;
		line-height: 24px;
	}

	>.content {
		display: flex;
		flex-direction: row;
	}
}
</style>
