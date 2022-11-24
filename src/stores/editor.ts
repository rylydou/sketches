import { ref, computed, reactive } from 'vue'
import { defineStore } from 'pinia'

export const useEditorStore = defineStore('editor', () => {
	var editor = reactive({
		brushSize: 1.0
	})
	return {
		editor,
	}
})
