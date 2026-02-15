<script setup lang="ts">
import { computed } from 'vue'
import type { KeyPosition } from '../../types/layout'
import type { Layer, KeyBinding } from '../../types/keymap'
import type { Theme, KeyStyle } from '../../types/theme'
import { keyToPixel, keyTransform } from '../../utils/coordinates'
import { computeLegendPlacements } from '../../composables/useKeyRenderer'

const props = defineProps<{
  keyPosition: KeyPosition
  keyIndex: number
  layers: Layer[]
  theme: Theme
  isSelected: boolean
  splitOffset: number
  mode: 'compact' | 'expanded'
  expandedLayerIndex?: number
}>()

const emit = defineEmits<{
  select: [index: number]
}>()

const pixel = computed(() => keyToPixel(props.keyPosition, props.theme))
const transform = computed(() => keyTransform(props.keyPosition, props.theme))
const radius = computed(() => props.theme.colors.keyDefault.borderRadius ?? props.theme.layout.borderRadius)

// Determine key style based on binding type
const keyStyle = computed<KeyStyle>(() => {
  const def = props.theme.colors.keyDefault
  let binding: KeyBinding | undefined

  if (props.mode === 'expanded' && props.expandedLayerIndex !== undefined) {
    const layer = props.layers[props.expandedLayerIndex]
    binding = layer?.bindings[props.keyIndex]
  } else if (props.layers.length > 0) {
    // In compact mode, use base layer binding for key style
    const visibleLayers = props.layers.filter(l => l.visible)
    binding = visibleLayers[0]?.bindings[props.keyIndex]
  }

  if (!binding) return def

  const typeStyle = props.theme.colors.keyStyles[binding.type]
  if (typeStyle) {
    return {
      fill: typeStyle.fill ?? def.fill,
      stroke: typeStyle.stroke ?? def.stroke,
      textColor: typeStyle.textColor ?? def.textColor,
      strokeWidth: typeStyle.strokeWidth ?? def.strokeWidth,
      strokeDasharray: typeStyle.strokeDasharray ?? def.strokeDasharray,
      borderRadius: typeStyle.borderRadius ?? def.borderRadius,
      opacity: typeStyle.opacity ?? def.opacity,
    }
  }

  return def
})

const legends = computed(() => {
  if (props.mode === 'expanded' && props.expandedLayerIndex !== undefined) {
    // In expanded mode, show only the binding for this specific layer
    const layer = props.layers[props.expandedLayerIndex]
    if (!layer) return []
    const binding = layer.bindings[props.keyIndex]
    if (!binding || binding.type === 'none') return []

    const result = []
    if (binding.type === 'transparent') {
      result.push({
        text: '▽',
        x: pixel.value.width / 2,
        y: pixel.value.height / 2 + props.theme.typography.primaryLabelSize * 0.35,
        fontSize: props.theme.typography.primaryLabelSize,
        color: props.theme.colors.keyStyles.transparent?.textColor ?? '#999',
        anchor: 'middle' as const,
        layerIndex: props.expandedLayerIndex,
      })
    } else {
      result.push({
        text: binding.label,
        x: pixel.value.width / 2,
        y: pixel.value.height / 2 + props.theme.typography.primaryLabelSize * 0.35,
        fontSize: props.theme.typography.primaryLabelSize,
        color: props.theme.colors.legendColors.primary,
        anchor: 'middle' as const,
        layerIndex: props.expandedLayerIndex,
      })
      if (binding.holdLabel) {
        result.push({
          text: binding.holdLabel,
          x: pixel.value.width / 2,
          y: props.theme.layout.keyPadding + props.theme.typography.holdLabelSize,
          fontSize: props.theme.typography.holdLabelSize,
          color: props.theme.colors.legendColors.hold,
          anchor: 'middle' as const,
          layerIndex: props.expandedLayerIndex,
          isHold: true,
        })
      }
    }
    return result
  }

  return computeLegendPlacements(
    props.keyIndex,
    props.layers,
    props.theme,
    pixel.value.width,
    pixel.value.height,
  )
})

const groupTransform = computed(() => {
  const tx = pixel.value.x + props.splitOffset
  const ty = pixel.value.y
  let t = `translate(${tx}, ${ty})`
  if (transform.value) {
    t += ` ${transform.value}`
  }
  return t
})
</script>

<template>
  <g
    :transform="groupTransform"
    class="keycap"
    :class="{ selected: isSelected }"
    @click.stop="emit('select', keyIndex)"
  >
    <!-- Key background -->
    <rect
      :width="pixel.width"
      :height="pixel.height"
      :rx="radius"
      :ry="radius"
      :fill="keyStyle.fill"
      :stroke="isSelected ? '#3b82f6' : keyStyle.stroke"
      :stroke-width="isSelected ? 2.5 : (keyStyle.strokeWidth ?? 1)"
      :stroke-dasharray="keyStyle.strokeDasharray ?? 'none'"
      :opacity="keyStyle.opacity ?? 1"
      style="cursor: pointer; transition: stroke 0.15s, stroke-width 0.15s;"
    />

    <!-- Selection highlight -->
    <rect
      v-if="isSelected"
      :width="pixel.width + 4"
      :height="pixel.height + 4"
      :x="-2"
      :y="-2"
      :rx="radius + 2"
      :ry="radius + 2"
      fill="none"
      stroke="#3b82f6"
      stroke-width="1.5"
      opacity="0.4"
    />

    <!-- Legend texts -->
    <text
      v-for="(legend, i) in legends"
      :key="i"
      :x="legend.x"
      :y="legend.y"
      :font-size="legend.fontSize"
      :fill="legend.color"
      :text-anchor="legend.anchor"
      :font-family="theme.typography.fontFamily"
      :font-weight="legend.isHold ? 400 : 500"
      :font-style="legend.isHold ? 'italic' : 'normal'"
      dominant-baseline="auto"
      style="pointer-events: none; user-select: none;"
    >{{ legend.text }}</text>
  </g>
</template>
