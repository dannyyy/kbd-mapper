<script setup lang="ts">
import { ref } from 'vue'
import { useEditorStore } from '../../stores/editor'
import BaseModal from '../ui/BaseModal.vue'

const editorStore = useEditorStore()

const exportFormat = ref<'svg' | 'png' | 'pdf'>('png')
const exportScale = ref(2)
const isExporting = ref(false)

async function handleExport() {
  isExporting.value = true
  try {
    // Export is implemented in Phase 7
    const { useExport } = await import('../../composables/useExport')
    const exporter = useExport()
    await exporter.exportAs(exportFormat.value, exportScale.value)
    editorStore.showExportDialog = false
  } catch (err) {
    console.error('Export failed:', err)
    alert('Export failed. Please try again.')
  } finally {
    isExporting.value = false
  }
}
</script>

<template>
  <BaseModal
    title="Export"
    :show="editorStore.showExportDialog"
    @close="editorStore.showExportDialog = false"
  >
    <div class="export-options">
      <div class="field">
        <label class="field-label">Format</label>
        <div class="format-buttons">
          <button
            v-for="fmt in (['svg', 'png', 'pdf'] as const)"
            :key="fmt"
            class="format-btn"
            :class="{ active: exportFormat === fmt }"
            @click="exportFormat = fmt"
          >{{ fmt.toUpperCase() }}</button>
        </div>
      </div>

      <div v-if="exportFormat === 'png'" class="field">
        <label class="field-label">Scale</label>
        <div class="scale-buttons">
          <button
            v-for="s in [1, 2, 3, 4]"
            :key="s"
            class="scale-btn"
            :class="{ active: exportScale === s }"
            @click="exportScale = s"
          >{{ s }}x</button>
        </div>
      </div>

      <button
        class="export-btn"
        :disabled="isExporting"
        @click="handleExport"
      >
        {{ isExporting ? 'Exporting...' : `Export ${exportFormat.toUpperCase()}` }}
      </button>
    </div>
  </BaseModal>
</template>

<style scoped>
.export-options {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field-label {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--text-secondary, #6b7280);
}

.format-buttons,
.scale-buttons {
  display: flex;
  gap: 6px;
}

.format-btn,
.scale-btn {
  flex: 1;
  padding: 8px 16px;
  border: 1px solid var(--border, #d1d5db);
  background: var(--surface, #fff);
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  color: var(--text-primary, #374151);
  transition: all 0.15s;
}

.format-btn:hover,
.scale-btn:hover {
  background: var(--hover, #f3f4f6);
}

.format-btn.active,
.scale-btn.active {
  background: var(--primary, #3b82f6);
  color: #fff;
  border-color: var(--primary, #3b82f6);
}

.export-btn {
  padding: 10px 20px;
  background: var(--primary, #3b82f6);
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: background 0.15s;
  margin-top: 8px;
}

.export-btn:hover:not(:disabled) {
  background: var(--primary-hover, #2563eb);
}

.export-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
