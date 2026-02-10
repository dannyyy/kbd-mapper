import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useEditorStore = defineStore('editor', () => {
  const selectedKeyIndex = ref<number | null>(null)
  const activeLayerId = ref<string | null>(null)
  const canvasZoom = ref(1)
  const canvasPan = ref({ x: 0, y: 0 })
  const showExportDialog = ref(false)
  const showThemeSelector = ref(false)
  const showLayoutSelector = ref(false)
  const showProjectDialog = ref(false)
  const sidebarTab = ref<'layers' | 'key'>('layers')

  const hasSelection = computed(() => selectedKeyIndex.value !== null)

  function selectKey(index: number | null) {
    selectedKeyIndex.value = index
    if (index !== null) {
      sidebarTab.value = 'key'
    }
  }

  function clearSelection() {
    selectedKeyIndex.value = null
  }

  function setActiveLayer(layerId: string) {
    activeLayerId.value = layerId
  }

  function setZoom(zoom: number) {
    canvasZoom.value = Math.max(0.25, Math.min(4, zoom))
  }

  function zoomIn() {
    setZoom(canvasZoom.value * 1.2)
  }

  function zoomOut() {
    setZoom(canvasZoom.value / 1.2)
  }

  function resetView() {
    canvasZoom.value = 1
    canvasPan.value = { x: 0, y: 0 }
  }

  function setPan(x: number, y: number) {
    canvasPan.value = { x, y }
  }

  return {
    selectedKeyIndex,
    activeLayerId,
    canvasZoom,
    canvasPan,
    showExportDialog,
    showThemeSelector,
    showLayoutSelector,
    showProjectDialog,
    sidebarTab,
    hasSelection,
    selectKey,
    clearSelection,
    setActiveLayer,
    setZoom,
    zoomIn,
    zoomOut,
    resetView,
    setPan,
  }
})
