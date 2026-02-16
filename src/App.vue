<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useEditorStore } from './stores/editor'
import { useProjectStore } from './stores/project'
import { downloadText } from './utils/download'
import AppHeader from './components/layout/AppHeader.vue'
import ProjectToolbar from './components/layout/ProjectToolbar.vue'
import MainWorkspace from './components/layout/MainWorkspace.vue'
import ThemeSelector from './components/dialogs/ThemeSelector.vue'
import ExportDialog from './components/dialogs/ExportDialog.vue'
import LayoutSelector from './components/dialogs/LayoutSelector.vue'

const editorStore = useEditorStore()
const projectStore = useProjectStore()

function handleKeydown(e: KeyboardEvent) {
  const meta = e.metaKey || e.ctrlKey

  // Escape: close dialogs or deselect
  if (e.key === 'Escape') {
    if (editorStore.showExportDialog) {
      editorStore.showExportDialog = false
      return
    }
    if (editorStore.showThemeSelector) {
      editorStore.showThemeSelector = false
      return
    }
    if (editorStore.showLayoutSelector) {
      editorStore.showLayoutSelector = false
      return
    }
    if (editorStore.selectedKeyIndex !== null) {
      editorStore.clearSelection()
      return
    }
  }

  // Cmd+S: save project
  if (meta && e.key === 's') {
    e.preventDefault()
    const json = projectStore.getProjectJson()
    downloadText(json, `${projectStore.project.name}.json`, 'application/json')
    projectStore.markKeymapSaved()
    return
  }

  // Cmd+E: export dialog
  if (meta && e.key === 'e') {
    e.preventDefault()
    editorStore.showExportDialog = true
    return
  }

  // Cmd+= / Cmd+-: zoom
  if (meta && (e.key === '=' || e.key === '+')) {
    e.preventDefault()
    editorStore.zoomIn()
    return
  }
  if (meta && e.key === '-') {
    e.preventDefault()
    editorStore.zoomOut()
    return
  }
  if (meta && e.key === '0') {
    e.preventDefault()
    editorStore.resetView()
    return
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <div id="app">
    <AppHeader />
    <ProjectToolbar />
    <MainWorkspace />

    <!-- Dialogs -->
    <ThemeSelector />
    <ExportDialog />
    <LayoutSelector />
  </div>
</template>

<style scoped>
#app {
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
</style>
