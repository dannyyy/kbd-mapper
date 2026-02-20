<script setup lang="ts">
import { useEditorStore } from '../../stores/editor'
import { useMobile } from '../../composables/useMobile'
import LayerPanel from '../editor/LayerPanel.vue'
import KeyEditor from '../editor/KeyEditor.vue'

const editorStore = useEditorStore()
const { isMobileLandscape } = useMobile()

function handleBackdropClick() {
  editorStore.closeSidebar()
}
</script>

<template>
  <!-- Desktop: always-visible sidebar -->
  <aside v-if="!isMobileLandscape" class="side-panel">
    <div class="tabs">
      <button
        class="tab"
        :class="{ active: editorStore.sidebarTab === 'layers' }"
        @click="editorStore.sidebarTab = 'layers'"
      >
        Layers
      </button>
      <button
        class="tab"
        :class="{ active: editorStore.sidebarTab === 'key' }"
        @click="editorStore.sidebarTab = 'key'"
      >
        Key
      </button>
    </div>

    <div class="tab-content">
      <LayerPanel v-if="editorStore.sidebarTab === 'layers'" />
      <KeyEditor v-else />
    </div>
  </aside>

  <!-- Mobile: slide-out drawer -->
  <Teleport v-else to="body">
    <Transition name="drawer">
      <div v-if="editorStore.sidebarOpen" class="drawer-backdrop" @click.self="handleBackdropClick">
        <aside class="drawer-panel">
          <div class="drawer-header">
            <div class="tabs">
              <button
                class="tab"
                :class="{ active: editorStore.sidebarTab === 'layers' }"
                @click="editorStore.sidebarTab = 'layers'"
              >
                Layers
              </button>
              <button
                class="tab"
                :class="{ active: editorStore.sidebarTab === 'key' }"
                @click="editorStore.sidebarTab = 'key'"
              >
                Key
              </button>
            </div>
            <button class="drawer-close" @click="editorStore.closeSidebar()">&times;</button>
          </div>

          <div class="tab-content">
            <LayerPanel v-if="editorStore.sidebarTab === 'layers'" />
            <KeyEditor v-else />
          </div>
        </aside>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* Desktop sidebar */
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
  transition:
    color 0.15s,
    background 0.15s;
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

/* Mobile drawer */
.drawer-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 50;
}

.drawer-panel {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 280px;
  max-width: 80vw;
  background: var(--surface, #fff);
  display: flex;
  flex-direction: column;
  box-shadow: -4px 0 20px rgba(0, 0, 0, 0.15);
}

.drawer-header {
  display: flex;
  align-items: stretch;
  border-bottom: 1px solid var(--border, #e5e7eb);
}

.drawer-header .tabs {
  flex: 1;
  border-bottom: none;
}

.drawer-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  border: none;
  background: transparent;
  font-size: 22px;
  cursor: pointer;
  color: var(--text-secondary, #9ca3af);
}

.drawer-close:hover {
  color: var(--text-primary, #1f2937);
}

/* Drawer transitions */
.drawer-enter-active,
.drawer-leave-active {
  transition: opacity 0.2s ease;
}

.drawer-enter-active .drawer-panel,
.drawer-leave-active .drawer-panel {
  transition: transform 0.25s ease;
}

.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
}

.drawer-enter-from .drawer-panel,
.drawer-leave-to .drawer-panel {
  transform: translateX(100%);
}
</style>
