<script setup lang="ts">
import { onMounted, onUnmounted, watch } from 'vue'
import { useEditorStore } from './stores/editor'
import { useProjectStore } from './stores/project'
import { useMobile } from './composables/useMobile'
import { downloadText } from './utils/download'
import AppHeader from './components/layout/AppHeader.vue'
import ProjectToolbar from './components/layout/ProjectToolbar.vue'
import MainWorkspace from './components/layout/MainWorkspace.vue'
import ThemeSelector from './components/dialogs/ThemeSelector.vue'
import ExportDialog from './components/dialogs/ExportDialog.vue'
import LayoutSelector from './components/dialogs/LayoutSelector.vue'

const editorStore = useEditorStore()
const projectStore = useProjectStore()
const { isMobileLandscape, isMobilePortrait } = useMobile()

// On mobile, auto-open sidebar when a key is selected
watch(
  () => editorStore.selectedKeyIndex,
  (index) => {
    if (isMobileLandscape.value && index !== null) {
      editorStore.openSidebar('key')
    }
  },
)

function handleKeydown(e: KeyboardEvent) {
  const meta = e.metaKey || e.ctrlKey

  // Escape: close dialogs or deselect
  if (e.key === 'Escape') {
    if (editorStore.sidebarOpen) {
      editorStore.closeSidebar()
      return
    }
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

    <!-- Portrait rotation prompt -->
    <div v-if="isMobilePortrait" class="rotate-prompt">
      <div class="rotate-prompt-content">
        <div class="rotate-icon">⤵</div>
        <p>Rotate your device to landscape for the best experience</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
#app {
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.rotate-prompt {
  position: fixed;
  inset: 0;
  background: var(--surface, #fff);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
}

.rotate-prompt-content {
  text-align: center;
  padding: 24px;
  color: var(--text-secondary, #6b7280);
}

.rotate-icon {
  font-size: 48px;
  margin-bottom: 16px;
  transform: rotate(-90deg);
}

.rotate-prompt-content p {
  font-size: 16px;
  line-height: 1.5;
  max-width: 240px;
}
</style>
