<script setup lang="ts">
import { computed } from 'vue'
import { useProjectStore } from '../../stores/project'
import { useThemeStore } from '../../stores/theme'
import { useEditorStore } from '../../stores/editor'
import KeyboardSvg from '../keyboard/KeyboardSvg.vue'
import LayerHeader from '../keyboard/LayerHeader.vue'

const projectStore = useProjectStore()
const themeStore = useThemeStore()
const editorStore = useEditorStore()

const mode = computed(() => projectStore.renderMode)
const theme = computed(() => themeStore.currentTheme)
const layers = computed(() => projectStore.layers)
const visibleLayers = computed(() => projectStore.visibleLayers)
const layout = computed(() => projectStore.layout)

function handleSelectKey(index: number | null) {
  editorStore.selectKey(index)
}
</script>

<template>
  <div class="keyboard-renderer" :data-mode="mode">
    <!-- Compact mode: single keyboard with all layers -->
    <template v-if="mode === 'compact'">
      <KeyboardSvg
        :layout="layout"
        :layers="layers"
        :theme="theme"
        :selected-key-index="editorStore.selectedKeyIndex"
        mode="compact"
        @select-key="handleSelectKey"
      />
    </template>

    <!-- Expanded mode: one keyboard per visible layer -->
    <template v-else>
      <div v-for="layer in visibleLayers" :key="layer.id" class="expanded-layer">
        <LayerHeader
          :name="layer.name"
          :color="layer.color"
          :font-family="theme.typography.fontFamily"
        />
        <KeyboardSvg
          :layout="layout"
          :layers="layers"
          :theme="theme"
          :selected-key-index="editorStore.selectedKeyIndex"
          mode="expanded"
          :expanded-layer-index="layers.indexOf(layer)"
          @select-key="handleSelectKey"
        />
      </div>
    </template>
  </div>
</template>

<style scoped>
.keyboard-renderer {
  display: flex;
  flex-direction: column;
  gap: 24px;
  align-items: center;
}

.expanded-layer {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
}
</style>
