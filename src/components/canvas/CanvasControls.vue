<script setup lang="ts">
import { computed } from 'vue'
import { useEditorStore } from '../../stores/editor'
import { useProjectStore } from '../../stores/project'

const editorStore = useEditorStore()
const projectStore = useProjectStore()

const zoomPercent = computed(() => Math.round(editorStore.canvasZoom * 100))
const renderMode = computed(() => projectStore.project.settings.renderMode)

function cycleRenderMode() {
  const modes: Array<'auto' | 'compact' | 'expanded'> = ['auto', 'compact', 'expanded']
  const current = modes.indexOf(renderMode.value)
  const next = modes[(current + 1) % modes.length]!
  projectStore.setRenderMode(next)
}
</script>

<template>
  <div class="canvas-controls">
    <button class="ctrl-btn" @click="editorStore.zoomOut" title="Zoom out">-</button>
    <span class="zoom-label">{{ zoomPercent }}%</span>
    <button class="ctrl-btn" @click="editorStore.zoomIn" title="Zoom in">+</button>
    <button class="ctrl-btn" @click="editorStore.resetView" title="Reset view">Fit</button>
    <div class="separator" />
    <button class="ctrl-btn mode-btn" @click="cycleRenderMode" :title="`Mode: ${renderMode}`">
      {{ renderMode === 'auto' ? 'Auto' : renderMode === 'compact' ? 'Compact' : 'Expanded' }}
    </button>
  </div>
</template>

<style scoped>
.canvas-controls {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  background: var(--surface, #fff);
  border: 1px solid var(--border, #e5e7eb);
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.ctrl-btn {
  padding: 4px 10px;
  border: none;
  background: transparent;
  color: var(--text-secondary, #6b7280);
  cursor: pointer;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 500;
  line-height: 1;
}

.ctrl-btn:hover {
  background: var(--hover, #f3f4f6);
  color: var(--text-primary, #1f2937);
}

.zoom-label {
  font-size: 12px;
  color: var(--text-secondary, #6b7280);
  min-width: 40px;
  text-align: center;
  font-variant-numeric: tabular-nums;
}

.separator {
  width: 1px;
  height: 18px;
  background: var(--border, #e5e7eb);
  margin: 0 4px;
}

.mode-btn {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
</style>
