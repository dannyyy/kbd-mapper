<script setup lang="ts">
import { computed } from 'vue'
import type { PhysicalLayout } from '../../types/layout'
import type { Layer } from '../../types/keymap'
import type { Theme } from '../../types/theme'
import { computeLayoutBounds, getSplitOffset } from '../../utils/coordinates'
import KeyCap from './KeyCap.vue'

const props = defineProps<{
  layout: PhysicalLayout
  layers: Layer[]
  theme: Theme
  selectedKeyIndex: number | null
  mode: 'compact' | 'expanded'
  expandedLayerIndex?: number
}>()

const emit = defineEmits<{
  selectKey: [index: number | null]
}>()

const padding = 20

const bounds = computed(() => computeLayoutBounds(
  props.layout.keys,
  props.theme,
  props.layout.splits,
))

const viewBox = computed(() => {
  const b = bounds.value
  return `${b.minX - padding} ${b.minY - padding} ${b.width + padding * 2} ${b.height + padding * 2}`
})

const svgWidth = computed(() => bounds.value.width + padding * 2)
const svgHeight = computed(() => bounds.value.height + padding * 2)

function getSplit(keyIndex: number): number {
  return getSplitOffset(keyIndex, props.layout.splits, props.theme.layout.splitGap)
}

function handleBackgroundClick() {
  emit('selectKey', null)
}
</script>

<template>
  <svg
    :viewBox="viewBox"
    :width="svgWidth"
    :height="svgHeight"
    xmlns="http://www.w3.org/2000/svg"
    class="keyboard-svg"
    @click="handleBackgroundClick"
  >
    <KeyCap
      v-for="(keyPos, index) in layout.keys"
      :key="index"
      :key-position="keyPos"
      :key-index="index"
      :layers="layers"
      :theme="theme"
      :is-selected="selectedKeyIndex === index"
      :split-offset="getSplit(index)"
      :mode="mode"
      :expanded-layer-index="expandedLayerIndex"
      @select="emit('selectKey', $event)"
    />
  </svg>
</template>
