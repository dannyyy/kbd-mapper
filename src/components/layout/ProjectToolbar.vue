<script setup lang="ts">
import { useProjectStore } from '../../stores/project'
import { useEditorStore } from '../../stores/editor'
import { downloadText } from '../../utils/download'

const projectStore = useProjectStore()
const editorStore = useEditorStore()

function handleSave() {
  const json = projectStore.getProjectJson()
  downloadText(json, `${projectStore.project.name}.json`, 'application/json')
}

function handleLoad() {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.json'
  input.onchange = async (e) => {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (!file) return
    try {
      const text = await file.text()
      const data = JSON.parse(text)
      projectStore.loadProject(data)
    } catch (err) {
      console.error('Failed to load project:', err)
      alert('Failed to load project file. Make sure it\'s a valid JSON file.')
    }
  }
  input.click()
}
</script>

<template>
  <div class="project-toolbar">
    <button class="toolbar-btn" @click="projectStore.resetProject" title="New project">New</button>
    <button class="toolbar-btn" @click="handleSave" title="Save project as JSON">Save</button>
    <button class="toolbar-btn" @click="handleLoad" title="Load project from JSON">Load</button>
    <div class="separator" />
    <button class="toolbar-btn" @click="editorStore.showLayoutSelector = true" title="Change layout">
      {{ projectStore.layout.name }}
    </button>
    <div class="separator" />
    <button class="toolbar-btn primary" @click="editorStore.showExportDialog = true" title="Export image">
      Export
    </button>
  </div>
</template>

<style scoped>
.project-toolbar {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 20px;
  background: var(--surface-secondary, #f9fafb);
  border-bottom: 1px solid var(--border, #e5e7eb);
  flex-shrink: 0;
}

.toolbar-btn {
  padding: 5px 12px;
  border: 1px solid var(--border, #d1d5db);
  background: var(--surface, #fff);
  border-radius: 5px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  color: var(--text-primary, #374151);
  transition: background 0.15s;
}

.toolbar-btn:hover {
  background: var(--hover, #f3f4f6);
}

.toolbar-btn.primary {
  background: var(--primary, #3b82f6);
  color: #fff;
  border-color: var(--primary, #3b82f6);
}

.toolbar-btn.primary:hover {
  background: var(--primary-hover, #2563eb);
}

.separator {
  width: 1px;
  height: 20px;
  background: var(--border, #e5e7eb);
  margin: 0 4px;
}
</style>
