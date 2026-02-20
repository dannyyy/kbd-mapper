<script setup lang="ts">
import { ref, computed } from 'vue'
import { useEditorStore } from '../../stores/editor'
import { useProjectStore } from '../../stores/project'
import { importFile, detectFormat, FORMAT_LABELS } from '../../utils/parsers'
import type { ImportFormat, ImportResult } from '../../types/import'
import type { Project } from '../../types/project'
import { generateId } from '../../utils/id'
import { getLayerColor, createEmptyBinding } from '../../utils/defaults'
import BaseModal from '../ui/BaseModal.vue'

const editorStore = useEditorStore()
const projectStore = useProjectStore()

// Dialog state
const step = ref<'select' | 'results'>('select')
const selectedFormat = ref<ImportFormat | 'auto'>('auto')
const fileContent = ref<string | null>(null)
const fileName = ref('')
const detectedFormat = ref<ImportFormat>('unknown')
const importResult = ref<ImportResult | null>(null)
const importError = ref<string | null>(null)
const isDragging = ref(false)

// For the results step
const layoutAction = ref<'keep' | 'use-imported'>('keep')

const hasImportedLayout = computed(() => importResult.value?.layout !== undefined)
const hasImportedKeymap = computed(() => importResult.value?.keymap !== undefined)
const isNativeFormat = computed(() => detectedFormat.value === 'kbd-mapper')

function resetDialog() {
  step.value = 'select'
  selectedFormat.value = 'auto'
  fileContent.value = null
  fileName.value = ''
  detectedFormat.value = 'unknown'
  importResult.value = null
  importError.value = null
  isDragging.value = false
  layoutAction.value = 'keep'
}

function handleClose() {
  editorStore.showImportDialog = false
  resetDialog()
}

function handleFileSelect() {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.json,.keymap,.vil'
  input.onchange = async (e) => {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (file) await processFile(file)
  }
  input.click()
}

function handleDrop(e: DragEvent) {
  isDragging.value = false
  const file = e.dataTransfer?.files[0]
  if (file) processFile(file)
}

function handleDragOver(e: DragEvent) {
  e.preventDefault()
  isDragging.value = true
}

function handleDragLeave() {
  isDragging.value = false
}

async function processFile(file: File) {
  importError.value = null
  fileName.value = file.name

  try {
    const content = await file.text()
    fileContent.value = content

    // Detect format
    const format =
      selectedFormat.value === 'auto' ? detectFormat(content, file.name) : selectedFormat.value
    detectedFormat.value = format

    if (format === 'unknown') {
      importError.value = 'Could not detect file format. Try selecting the format manually.'
      return
    }

    // For native format, use the existing load path
    if (format === 'kbd-mapper') {
      const data = JSON.parse(content) as Project
      importResult.value = {
        warnings: [],
        metadata: { sourceFormat: 'kbd-mapper', keyboardName: data.name },
      }
      step.value = 'results'
      return
    }

    // Parse the file
    const result = importFile(content, file.name, format)
    importResult.value = result
    detectedFormat.value = format

    // Default layout action based on what's available
    if (result.layout) {
      layoutAction.value = 'use-imported'
    } else {
      layoutAction.value = 'keep'
    }

    step.value = 'results'
  } catch (err) {
    console.error('Import failed:', err)
    importError.value = err instanceof Error ? err.message : 'Failed to parse file'
  }
}

function handleApply() {
  if (!importResult.value) return

  // Native format: load as project directly
  if (isNativeFormat.value && fileContent.value) {
    try {
      const data = JSON.parse(fileContent.value) as Project
      projectStore.loadProject(data)
      editorStore.clearSelection()
      handleClose()
      return
    } catch {
      importError.value = 'Failed to load project file'
      return
    }
  }

  const result = importResult.value

  // Apply imported layout if selected
  if (layoutAction.value === 'use-imported' && result.layout) {
    projectStore.project.layout = {
      ...result.layout,
      keys: result.layout.keys.map((k) => ({ ...k })),
      splits: result.layout.splits ? [...result.layout.splits] : undefined,
      metadata: { ...result.layout.metadata },
    }
  }

  // Apply imported keymap
  if (result.keymap) {
    const currentKeyCount = projectStore.keyCount

    const layers = result.keymap.layers.map((layer, i) => {
      let bindings = layer.bindings.map((b) => ({ ...b }))

      // Handle key count mismatch
      if (bindings.length < currentKeyCount) {
        // Pad with empty bindings
        const padding = Array.from({ length: currentKeyCount - bindings.length }, () =>
          createEmptyBinding(),
        )
        bindings = [...bindings, ...padding]
      } else if (bindings.length > currentKeyCount) {
        // Truncate
        bindings = bindings.slice(0, currentKeyCount)
      }

      return {
        id: generateId('layer'),
        name: layer.name,
        color: getLayerColor(i),
        bindings,
        visible: layer.visible,
      }
    })

    projectStore.project.keymap = {
      id: generateId('keymap'),
      name: result.keymap.name,
      layers,
    }
  }

  projectStore.markKeymapSaved()
  editorStore.clearSelection()
  handleClose()
}

const formatOptions = computed(() => [
  { value: 'auto' as const, label: 'Auto-detect (recommended)' },
  { value: 'kbd-mapper' as const, label: 'kbd-mapper Project (.json)' },
  { value: 'qmk-keymap' as const, label: 'QMK Keymap (.json)' },
  { value: 'qmk-info' as const, label: 'QMK Keyboard Info (.json)' },
  { value: 'via-definition' as const, label: 'VIA/VIAL Definition (.json)' },
  { value: 'via-backup' as const, label: 'VIA Keymap Backup (.json)' },
  { value: 'vial' as const, label: 'VIAL Saved Layout (.vil)' },
  { value: 'zmk-keymap' as const, label: 'ZMK Keymap (.keymap)' },
  { value: 'kle' as const, label: 'KLE Layout (.json)' },
])

const keyCountMismatch = computed(() => {
  if (!importResult.value?.keymap) return null
  const importedCount = importResult.value.keymap.layers[0]?.bindings.length ?? 0
  const currentCount = projectStore.keyCount
  if (importedCount !== currentCount) {
    return { imported: importedCount, current: currentCount }
  }
  return null
})
</script>

<template>
  <BaseModal title="Import" :show="editorStore.showImportDialog" @close="handleClose">
    <!-- Step 1: File selection -->
    <div v-if="step === 'select'" class="import-step">
      <div
        class="drop-zone"
        :class="{ dragging: isDragging }"
        @click="handleFileSelect"
        @drop.prevent="handleDrop"
        @dragover="handleDragOver"
        @dragleave="handleDragLeave"
      >
        <div class="drop-icon">
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
          >
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
          </svg>
        </div>
        <span class="drop-text">Drop file here or click to browse</span>
        <span class="drop-hint">.json, .keymap, or .vil</span>
      </div>

      <div class="format-section">
        <label class="section-label">Format</label>
        <div class="format-list">
          <label
            v-for="opt in formatOptions"
            :key="opt.value"
            class="format-option"
            :class="{ active: selectedFormat === opt.value }"
          >
            <input
              v-model="selectedFormat"
              type="radio"
              name="format"
              :value="opt.value"
              class="format-radio"
            />
            <span>{{ opt.label }}</span>
          </label>
        </div>
      </div>

      <div v-if="importError" class="error-message">
        {{ importError }}
      </div>
    </div>

    <!-- Step 2: Import results -->
    <div v-if="step === 'results' && importResult" class="import-step">
      <div class="result-summary">
        <div class="result-item success">
          <span class="result-icon">&#10003;</span>
          <span
            >Detected format: <strong>{{ FORMAT_LABELS[detectedFormat] }}</strong></span
          >
        </div>

        <div v-if="isNativeFormat" class="result-item success">
          <span class="result-icon">&#10003;</span>
          <span>
            kbd-mapper project
            <strong v-if="importResult.metadata.keyboardName"
              >"{{ importResult.metadata.keyboardName }}"</strong
            >
          </span>
        </div>

        <template v-if="!isNativeFormat">
          <div v-if="hasImportedKeymap" class="result-item success">
            <span class="result-icon">&#10003;</span>
            <span>
              Imported {{ importResult.keymap!.layers.length }} layers with
              {{ importResult.keymap!.layers[0]?.bindings.length ?? 0 }} keys each
            </span>
          </div>

          <div v-if="hasImportedLayout" class="result-item success">
            <span class="result-icon">&#10003;</span>
            <span>
              Imported layout: {{ importResult.layout!.name }} ({{
                importResult.layout!.keys.length
              }}
              keys)
            </span>
          </div>

          <div v-if="!hasImportedKeymap && !hasImportedLayout" class="result-item warning">
            <span class="result-icon">!</span>
            <span>No data could be extracted from the file</span>
          </div>
        </template>
      </div>

      <!-- Warnings -->
      <div v-if="importResult.warnings.length > 0" class="warnings-section">
        <div class="section-label">
          {{ importResult.warnings.length }} warning{{
            importResult.warnings.length !== 1 ? 's' : ''
          }}
        </div>
        <div class="warnings-list">
          <div v-for="(w, i) in importResult.warnings.slice(0, 10)" :key="i" class="warning-item">
            <span class="warning-icon">&#9888;</span>
            <span>{{ w.message }}</span>
          </div>
          <div v-if="importResult.warnings.length > 10" class="warning-item more">
            ...and {{ importResult.warnings.length - 10 }} more
          </div>
        </div>
      </div>

      <!-- Layout action (when importing keymap-only formats) -->
      <div v-if="!isNativeFormat && hasImportedLayout" class="layout-section">
        <div class="section-label">Physical layout</div>
        <label class="format-option" :class="{ active: layoutAction === 'use-imported' }">
          <input
            v-model="layoutAction"
            type="radio"
            name="layout-action"
            value="use-imported"
            class="format-radio"
          />
          <span>Use imported layout ({{ importResult.layout!.keys.length }} keys)</span>
        </label>
        <label class="format-option" :class="{ active: layoutAction === 'keep' }">
          <input
            v-model="layoutAction"
            type="radio"
            name="layout-action"
            value="keep"
            class="format-radio"
          />
          <span>Keep current layout ({{ projectStore.layout.name }})</span>
        </label>
      </div>

      <!-- Key count mismatch warning -->
      <div
        v-if="!isNativeFormat && keyCountMismatch && layoutAction === 'keep'"
        class="mismatch-warning"
      >
        <span class="warning-icon">&#9888;</span>
        Key count mismatch: file has {{ keyCountMismatch.imported }} keys, current layout has
        {{ keyCountMismatch.current }}.
        <template v-if="keyCountMismatch.imported < keyCountMismatch.current">
          Extra positions will use empty bindings.
        </template>
        <template v-else> Excess keys will be trimmed. </template>
      </div>

      <!-- Actions -->
      <div class="result-actions">
        <button class="action-btn btn-secondary" @click="step = 'select'">Back</button>
        <button
          class="action-btn btn-primary"
          :disabled="!isNativeFormat && !hasImportedKeymap && !hasImportedLayout"
          @click="handleApply"
        >
          {{ isNativeFormat ? 'Load Project' : 'Apply' }}
        </button>
      </div>
    </div>
  </BaseModal>
</template>

<style scoped>
.import-step {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.drop-zone {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 32px 20px;
  border: 2px dashed var(--border, #d1d5db);
  border-radius: 10px;
  cursor: pointer;
  transition:
    border-color 0.15s,
    background 0.15s;
  color: var(--text-secondary, #6b7280);
}

.drop-zone:hover,
.drop-zone.dragging {
  border-color: var(--primary, #3b82f6);
  background: var(--primary-light, #eff6ff);
}

.drop-icon {
  opacity: 0.5;
}

.drop-text {
  font-size: 14px;
  font-weight: 500;
}

.drop-hint {
  font-size: 12px;
  opacity: 0.7;
}

.format-section {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.section-label {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--text-secondary, #6b7280);
}

.format-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.format-option {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 13px;
  color: var(--text-primary, #374151);
  transition: background 0.1s;
}

.format-option:hover {
  background: var(--hover, #f3f4f6);
}

.format-option.active {
  background: var(--primary-light, #eff6ff);
  color: var(--primary, #3b82f6);
}

.format-radio {
  margin: 0;
  accent-color: var(--primary, #3b82f6);
}

.error-message {
  padding: 10px 14px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 6px;
  color: #dc2626;
  font-size: 13px;
}

.result-summary {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.result-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--text-primary, #374151);
}

.result-item.success .result-icon {
  color: #059669;
  font-weight: bold;
}

.result-item.warning .result-icon {
  color: #d97706;
  font-weight: bold;
}

.warnings-section {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.warnings-list {
  max-height: 150px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 8px;
  background: #fffbeb;
  border: 1px solid #fde68a;
  border-radius: 6px;
}

.warning-item {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  font-size: 12px;
  color: #92400e;
}

.warning-item.more {
  font-style: italic;
  color: #b45309;
}

.warning-icon {
  flex-shrink: 0;
  color: #d97706;
}

.layout-section {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.mismatch-warning {
  padding: 10px 14px;
  background: #fffbeb;
  border: 1px solid #fde68a;
  border-radius: 6px;
  color: #92400e;
  font-size: 13px;
  display: flex;
  align-items: flex-start;
  gap: 6px;
}

.result-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 4px;
}

.action-btn {
  padding: 8px 20px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s;
}

.btn-secondary {
  background: var(--surface, #fff);
  color: var(--text-primary, #374151);
  border: 1px solid var(--border, #d1d5db);
}

.btn-secondary:hover {
  background: var(--hover, #f3f4f6);
}

.btn-primary {
  background: var(--primary, #3b82f6);
  color: #fff;
  border: 1px solid var(--primary, #3b82f6);
}

.btn-primary:hover:not(:disabled) {
  background: var(--primary-hover, #2563eb);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
