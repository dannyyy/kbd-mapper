<script setup lang="ts">
import { useProjectStore } from '../../stores/project'
import { useEditorStore } from '../../stores/editor'
import LayerItem from './LayerItem.vue'

const projectStore = useProjectStore()
const editorStore = useEditorStore()
</script>

<template>
  <div class="layer-panel">
    <div class="panel-header">
      <h3 class="panel-title">Layers</h3>
      <button class="add-btn" @click="projectStore.addLayer()" title="Add layer">+</button>
    </div>

    <div class="layer-list">
      <LayerItem
        v-for="(layer, index) in projectStore.layers"
        :key="layer.id"
        :layer="layer"
        :index="index"
        :is-active="editorStore.activeLayerId === layer.id"
        :is-first="index <= 1"
        :is-last="index === projectStore.layers.length - 1"
        @activate="editorStore.setActiveLayer(layer.id)"
        @toggle-visibility="projectStore.toggleLayerVisibility(layer.id)"
        @rename="projectStore.renameLayer(layer.id, $event)"
        @set-color="projectStore.setLayerColor(layer.id, $event)"
        @remove="projectStore.removeLayer(layer.id)"
        @move-up="projectStore.reorderLayer(index, index - 1)"
        @move-down="projectStore.reorderLayer(index, index + 1)"
      />
    </div>
  </div>
</template>

<style scoped>
.layer-panel {
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

.add-btn {
  width: 24px;
  height: 24px;
  border: 1px solid var(--border, #d1d5db);
  background: var(--surface, #fff);
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  color: var(--text-secondary, #6b7280);
  line-height: 1;
}

.add-btn:hover {
  background: var(--hover, #f3f4f6);
  color: var(--text-primary, #1f2937);
}

.layer-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
</style>
