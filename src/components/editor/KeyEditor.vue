<script setup lang="ts">
import { ref, computed } from 'vue'
import { useProjectStore } from '../../stores/project'
import { useEditorStore } from '../../stores/editor'
import LayerBindingEditor from './LayerBindingEditor.vue'

const projectStore = useProjectStore()
const editorStore = useEditorStore()

const showAllLayers = ref(false)

const keyIndex = computed(() => editorStore.selectedKeyIndex)

const displayedLayers = computed(() => {
  if (showAllLayers.value) return projectStore.layers
  return projectStore.visibleLayers
})

const hasHiddenLayers = computed(() => projectStore.layers.some((l) => !l.visible))
</script>

<template>
  <div class="key-editor">
    <template v-if="keyIndex !== null">
      <div class="panel-header">
        <h3 class="panel-title">Key #{{ keyIndex }}</h3>
        <button class="close-btn" @click="editorStore.clearSelection" title="Deselect">
          &times;
        </button>
      </div>

      <div v-if="hasHiddenLayers" class="show-all-toggle">
        <label class="toggle-label">
          <input type="checkbox" v-model="showAllLayers" class="toggle-checkbox" />
          Show hidden layers
        </label>
      </div>

      <div class="bindings-list">
        <LayerBindingEditor
          v-for="layer in displayedLayers"
          :key="layer.id"
          :layer="layer"
          :key-index="keyIndex"
        />
      </div>
    </template>
    <template v-else>
      <div class="empty-state">
        <p>Click a key to edit its bindings</p>
      </div>
    </template>
  </div>
</template>

<style scoped>
.key-editor {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 4px;
}

.panel-title {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--text-secondary, #6b7280);
  margin: 0;
}

.close-btn {
  border: none;
  background: none;
  cursor: pointer;
  font-size: 18px;
  color: var(--text-secondary, #9ca3af);
  padding: 0 4px;
  line-height: 1;
}

.close-btn:hover {
  color: var(--text-primary, #1f2937);
}

.show-all-toggle {
  padding: 0 4px;
}

.toggle-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: var(--text-secondary, #6b7280);
  cursor: pointer;
  user-select: none;
}

.toggle-checkbox {
  width: 13px;
  height: 13px;
  cursor: pointer;
}

.bindings-list {
  display: flex;
  flex-direction: column;
}

.empty-state {
  padding: 24px 16px;
  text-align: center;
  color: var(--text-secondary, #9ca3af);
  font-size: 13px;
}
</style>
