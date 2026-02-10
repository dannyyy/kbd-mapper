<script setup lang="ts">
import { useEditorStore } from '../../stores/editor'
import LayerPanel from '../editor/LayerPanel.vue'
import KeyEditor from '../editor/KeyEditor.vue'

const editorStore = useEditorStore()
</script>

<template>
  <aside class="side-panel">
    <div class="tabs">
      <button
        class="tab"
        :class="{ active: editorStore.sidebarTab === 'layers' }"
        @click="editorStore.sidebarTab = 'layers'"
      >Layers</button>
      <button
        class="tab"
        :class="{ active: editorStore.sidebarTab === 'key' }"
        @click="editorStore.sidebarTab = 'key'"
      >Key</button>
    </div>

    <div class="tab-content">
      <LayerPanel v-if="editorStore.sidebarTab === 'layers'" />
      <KeyEditor v-else />
    </div>
  </aside>
</template>

<style scoped>
.side-panel {
  width: 260px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  background: var(--surface, #fff);
  border: 1px solid var(--border, #e5e7eb);
  border-radius: 12px;
  overflow: hidden;
}

.tabs {
  display: flex;
  border-bottom: 1px solid var(--border, #e5e7eb);
}

.tab {
  flex: 1;
  padding: 10px;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--text-secondary, #9ca3af);
  transition: color 0.15s, background 0.15s;
}

.tab:hover {
  background: var(--hover, #f9fafb);
}

.tab.active {
  color: var(--primary, #3b82f6);
  box-shadow: inset 0 -2px 0 var(--primary, #3b82f6);
}

.tab-content {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
}
</style>
