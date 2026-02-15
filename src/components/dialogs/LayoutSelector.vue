<script setup lang="ts">
import { ref } from 'vue'
import { useEditorStore } from '../../stores/editor'
import { useProjectStore } from '../../stores/project'
import { builtinLayouts } from '../../data/layouts'
import { getDefaultKeymapData } from '../../data/keycodes'
import { generateId } from '../../utils/id'
import { getLayerColor, createEmptyBinding } from '../../utils/defaults'
import { downloadText } from '../../utils/download'
import BaseModal from '../ui/BaseModal.vue'

const editorStore = useEditorStore()
const projectStore = useProjectStore()

const pendingLayoutId = ref<string | null>(null)

function selectLayout(layoutId: string) {
  if (layoutId === projectStore.project.layout.id) return

  if (projectStore.hasKeymapChanged()) {
    pendingLayoutId.value = layoutId
  } else {
    applyLayout(layoutId)
  }
}

function applyLayout(layoutId: string) {
  const newLayout = builtinLayouts.find(l => l.id === layoutId)
  if (!newLayout) return

  projectStore.project.layout = {
    ...newLayout,
    keys: newLayout.keys.map(k => ({ ...k })),
    splits: newLayout.splits ? [...newLayout.splits] : undefined,
    metadata: { ...newLayout.metadata, tags: newLayout.metadata.tags ? [...newLayout.metadata.tags] : undefined },
  }

  const defaultKeymap = getDefaultKeymapData(layoutId)
  if (defaultKeymap) {
    projectStore.project.keymap.layers = defaultKeymap.layers.map((layer, i) => ({
      id: generateId('layer'),
      name: layer.name,
      color: getLayerColor(i),
      bindings: layer.bindings.map(b => ({ ...b })),
      visible: true,
    }))
  } else {
    projectStore.project.keymap.layers = [{
      id: generateId('layer'),
      name: 'Base',
      color: getLayerColor(0),
      bindings: Array.from({ length: newLayout.keys.length }, () => createEmptyBinding()),
      visible: true,
    }]
  }

  projectStore.markKeymapSaved()
  editorStore.clearSelection()
  editorStore.showLayoutSelector = false
}

function confirmSwitch() {
  if (pendingLayoutId.value) {
    applyLayout(pendingLayoutId.value)
  }
  pendingLayoutId.value = null
}

function cancelSwitch() {
  pendingLayoutId.value = null
}

function saveAndSwitch() {
  const json = projectStore.getProjectJson()
  downloadText(json, `${projectStore.project.name}.json`, 'application/json')
  projectStore.markKeymapSaved()
  confirmSwitch()
}
</script>

<template>
  <BaseModal
    title="Choose Layout"
    :show="editorStore.showLayoutSelector"
    @close="editorStore.showLayoutSelector = false"
  >
    <div class="layout-grid">
      <button
        v-for="layout in builtinLayouts"
        :key="layout.id"
        class="layout-card"
        :class="{ active: projectStore.layout.id === layout.id }"
        @click="selectLayout(layout.id)"
      >
        <span class="layout-name">{{ layout.name }}</span>
        <span class="layout-info">{{ layout.keys.length }} keys</span>
        <div v-if="layout.metadata.tags" class="layout-tags">
          <span v-for="tag in layout.metadata.tags" :key="tag" class="tag">{{ tag }}</span>
        </div>
      </button>
    </div>
  </BaseModal>

  <!-- Confirmation dialog -->
  <BaseModal
    title="Unsaved Changes"
    :show="pendingLayoutId !== null"
    @close="cancelSwitch"
  >
    <div class="confirm-content">
      <p class="confirm-message">
        You have unsaved changes to your key mappings. Do you want to save before switching layouts?
      </p>
      <div class="confirm-actions">
        <button class="confirm-btn btn-secondary" @click="cancelSwitch">Cancel</button>
        <button class="confirm-btn btn-save" @click="saveAndSwitch">Save &amp; Switch</button>
        <button class="confirm-btn btn-primary" @click="confirmSwitch">Switch</button>
      </div>
    </div>
  </BaseModal>
</template>

<style scoped>
.layout-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 12px;
}

.layout-card {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 14px;
  border: 2px solid var(--border, #e5e7eb);
  background: var(--surface, #fff);
  border-radius: 8px;
  cursor: pointer;
  text-align: left;
  transition: border-color 0.15s, box-shadow 0.15s;
}

.layout-card:hover {
  border-color: var(--primary, #3b82f6);
}

.layout-card.active {
  border-color: var(--primary, #3b82f6);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
}

.layout-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary, #1f2937);
}

.layout-info {
  font-size: 12px;
  color: var(--text-secondary, #6b7280);
}

.layout-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 4px;
}

.tag {
  font-size: 10px;
  padding: 2px 6px;
  background: var(--surface-secondary, #f3f4f6);
  color: var(--text-secondary, #6b7280);
  border-radius: 3px;
}

.confirm-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.confirm-message {
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
  color: var(--text-primary, #1f2937);
}

.confirm-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.confirm-btn {
  padding: 8px 16px;
  border: 1px solid var(--border, #e5e7eb);
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
}

.btn-secondary {
  background: var(--surface, #fff);
  color: var(--text-primary, #1f2937);
}

.btn-secondary:hover {
  background: var(--surface-secondary, #f3f4f6);
}

.btn-save {
  background: var(--surface, #fff);
  color: #059669;
  border-color: #059669;
}

.btn-save:hover {
  background: #ecfdf5;
}

.btn-primary {
  background: #3b82f6;
  color: #fff;
  border-color: #3b82f6;
}

.btn-primary:hover {
  background: #2563eb;
}
</style>
