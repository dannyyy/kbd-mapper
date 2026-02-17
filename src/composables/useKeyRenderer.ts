import type { Layer } from '../types/keymap'
import type { Theme } from '../types/theme'

export interface LegendPlacement {
  text: string
  x: number
  y: number
  fontSize: number
  color: string
  anchor: 'start' | 'middle' | 'end'
  layerIndex: number
  isHold?: boolean
}

/**
 * Compute legend text placements for a single key in compact mode.
 *
 * Layout (up to 5 visible layers + shift):
 * +-------------------------------+
 * | [L1]      Shift/Hold   [L2]  |  top-left / top-center / top-right
 * |                               |
 * |          L0 (large)           |  center
 * |                               |
 * | [L4]                   [L3]  |  bottom-left / bottom-right
 * +-------------------------------+
 *
 * L0 = base layer (center, large)
 * Shift = top-center (only if different from base, suppressed when redundant)
 * L0 hold = top-center (takes priority over shift if both exist)
 * L1..L4 = clockwise corners: top-left, top-right, bottom-right, bottom-left
 */
export function computeLegendPlacements(
  keyIndex: number,
  layers: Layer[],
  theme: Theme,
  keyWidth: number,
  keyHeight: number,
): LegendPlacement[] {
  const placements: LegendPlacement[] = []
  const pad = theme.layout.keyPadding
  const layerColors = theme.colors.layerLabelColors

  const visibleLayers = layers.filter((l) => l.visible)
  if (visibleLayers.length === 0) return placements

  // Base layer (layer 0 / first visible) - center
  const baseLayer = visibleLayers[0]!
  const baseBinding = baseLayer.bindings[keyIndex]
  let hasHoldLabel = false
  if (baseBinding && baseBinding.type !== 'none') {
    placements.push({
      text: baseBinding.label,
      x: keyWidth / 2,
      y: keyHeight / 2 + theme.typography.primaryLabelSize * 0.35,
      fontSize: theme.typography.primaryLabelSize,
      color: theme.colors.legendColors.primary,
      anchor: 'middle',
      layerIndex: 0,
    })

    // Hold behavior (mod-tap / layer-tap) - top center
    if (
      baseBinding.holdLabel &&
      (baseBinding.type === 'mod-tap' || baseBinding.type === 'layer-tap')
    ) {
      hasHoldLabel = true
      placements.push({
        text: baseBinding.holdLabel,
        x: keyWidth / 2,
        y: pad + theme.typography.holdLabelSize,
        fontSize: theme.typography.holdLabelSize,
        color: theme.colors.legendColors.hold,
        anchor: 'middle',
        layerIndex: 0,
        isHold: true,
      })
    }
  }

  // Separate shift layer from other visible layers
  const shiftLayerIndex = visibleLayers.findIndex(
    (l, i) => i > 0 && l.name.toLowerCase() === 'shift',
  )
  const nonShiftLayers = visibleLayers.filter((_, i) => i > 0 && i !== shiftLayerIndex)

  // Shift layer - top center (only when label differs from base)
  if (shiftLayerIndex > 0 && !hasHoldLabel) {
    const shiftLayer = visibleLayers[shiftLayerIndex]!
    const shiftBinding = shiftLayer.bindings[keyIndex]
    const shiftLayerIdx = layers.indexOf(shiftLayer)

    if (
      shiftBinding &&
      shiftBinding.type !== 'transparent' &&
      shiftBinding.type !== 'none' &&
      shiftBinding.label &&
      baseBinding &&
      shiftBinding.label.toLowerCase() !== baseBinding.label.toLowerCase()
    ) {
      placements.push({
        text: shiftBinding.label,
        x: keyWidth / 2,
        y: pad + theme.typography.secondaryLabelSize,
        fontSize: theme.typography.secondaryLabelSize,
        color: layerColors[shiftLayerIdx % layerColors.length]!,
        anchor: 'middle',
        layerIndex: shiftLayerIdx,
      })
    }
  }

  // Corner positions clockwise: top-left, top-right, bottom-right, bottom-left
  const cornerPositions: Array<{
    x: number
    y: number
    anchor: 'start' | 'end'
  }> = [
    { x: pad, y: pad + theme.typography.secondaryLabelSize, anchor: 'start' }, // top-left
    {
      x: keyWidth - pad,
      y: pad + theme.typography.secondaryLabelSize,
      anchor: 'end',
    }, // top-right
    { x: keyWidth - pad, y: keyHeight - pad, anchor: 'end' }, // bottom-right
    { x: pad, y: keyHeight - pad, anchor: 'start' }, // bottom-left
  ]

  for (let i = 0; i < Math.min(nonShiftLayers.length, 4); i++) {
    const layer = nonShiftLayers[i]!
    const binding = layer.bindings[keyIndex]

    if (binding && binding.type !== 'transparent' && binding.type !== 'none' && binding.label) {
      const pos = cornerPositions[i]!
      const layerIdx = layers.indexOf(layer)

      placements.push({
        text: binding.label,
        x: pos.x,
        y: pos.y,
        fontSize: theme.typography.secondaryLabelSize,
        color: layerColors[layerIdx % layerColors.length]!,
        anchor: pos.anchor,
        layerIndex: layerIdx,
      })
    }
  }

  return placements
}
