<script setup lang="ts">
import { computed } from 'vue'
import type { Layer, KeyType } from '../../types/keymap'
import { useProjectStore } from '../../stores/project'

const props = defineProps<{
  layer: Layer
  keyIndex: number
}>()

const projectStore = useProjectStore()

const binding = computed(() => props.layer.bindings[props.keyIndex])

const keyTypes: { value: KeyType; label: string }[] = [
  { value: 'normal', label: 'Normal' },
  { value: 'modifier', label: 'Modifier' },
  { value: 'layer-toggle', label: 'Layer Toggle' },
  { value: 'layer-tap', label: 'Layer Tap' },
  { value: 'mod-tap', label: 'Mod Tap' },
  { value: 'navigation', label: 'Navigation' },
  { value: 'function', label: 'Function' },
  { value: 'media', label: 'Media' },
  { value: 'transparent', label: 'Transparent' },
  { value: 'none', label: 'None' },
  { value: 'custom', label: 'Custom' },
]

const hasHold = computed(() =>
  binding.value?.type === 'mod-tap' || binding.value?.type === 'layer-tap'
)

function updateLabel(value: string) {
  projectStore.setKeyLabel(props.layer.id, props.keyIndex, value)
}

function updateType(value: string) {
  projectStore.setKeyType(props.layer.id, props.keyIndex, value as KeyType)
}

function updateHoldLabel(value: string) {
  const holdType = binding.value?.type === 'layer-tap' ? 'layer-toggle' : 'modifier'
  projectStore.setKeyHold(props.layer.id, props.keyIndex, value, holdType as KeyType)
}
</script>

<template>
  <div class="layer-binding-editor">
    <div class="binding-header">
      <span class="layer-dot" :style="{ backgroundColor: layer.color }" />
      <span class="layer-name">{{ layer.name }}</span>
    </div>

    <div class="field">
      <label class="field-label">Label</label>
      <input
        class="field-input"
        :value="binding?.label ?? ''"
        @input="updateLabel(($event.target as HTMLInputElement).value)"
        placeholder="Key label"
      />
    </div>

    <div class="field">
      <label class="field-label">Type</label>
      <select
        class="field-select"
        :value="binding?.type ?? 'none'"
        @change="updateType(($event.target as HTMLSelectElement).value)"
      >
        <option v-for="kt in keyTypes" :key="kt.value" :value="kt.value">
          {{ kt.label }}
        </option>
      </select>
    </div>

    <div v-if="hasHold" class="field">
      <label class="field-label">Hold</label>
      <input
        class="field-input"
        :value="binding?.holdLabel ?? ''"
        @input="updateHoldLabel(($event.target as HTMLInputElement).value)"
        placeholder="Hold action"
      />
    </div>
  </div>
</template>

<style scoped>
.layer-binding-editor {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 8px 0;
  border-bottom: 1px solid var(--border-light, #f3f4f6);
}

.binding-header {
  display: flex;
  align-items: center;
  gap: 6px;
}

.layer-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.layer-name {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-primary, #1f2937);
}

.field {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.field-label {
  font-size: 11px;
  font-weight: 500;
  color: var(--text-secondary, #6b7280);
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.field-input,
.field-select {
  padding: 5px 8px;
  border: 1px solid var(--border, #d1d5db);
  border-radius: 4px;
  font-size: 13px;
  background: var(--surface, #fff);
  color: var(--text-primary, #1f2937);
  outline: none;
  transition: border-color 0.15s;
}

.field-input:focus,
.field-select:focus {
  border-color: var(--primary, #3b82f6);
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.15);
}
</style>
