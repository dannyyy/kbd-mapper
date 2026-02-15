import type { Layer } from "../types/keymap";
import type { Theme } from "../types/theme";

export interface LegendPlacement {
  text: string;
  x: number;
  y: number;
  fontSize: number;
  color: string;
  anchor: "start" | "middle" | "end";
  layerIndex: number;
  isHold?: boolean;
}

/**
 * Compute legend text placements for a single key in compact mode.
 *
 * Layout (up to 5 visible layers):
 * +-------------------------------+
 * | [L1]            L0-hold [L4]  |  top-left / top-center / top-right
 * |                               |
 * |          L0 (large)           |  center
 * |                               |
 * | [L2]                   [L3]  |  bottom-left / bottom-right
 * +-------------------------------+
 *
 * L0 = base layer (center, large)
 * L0 hold = if mod-tap/layer-tap (top-center, small)
 * L1 = top-left corner
 * L2 = bottom-left corner
 * L3 = bottom-right corner
 * L4 = top-right corner
 */
export function computeLegendPlacements(
  keyIndex: number,
  layers: Layer[],
  theme: Theme,
  keyWidth: number,
  keyHeight: number,
): LegendPlacement[] {
  const placements: LegendPlacement[] = [];
  const pad = theme.layout.keyPadding;
  const layerColors = theme.colors.layerLabelColors;

  const visibleLayers = layers.filter((l) => l.visible);
  if (visibleLayers.length === 0) return placements;

  // Base layer (layer 0 / first visible) - center
  const baseLayer = visibleLayers[0]!;
  const baseBinding = baseLayer.bindings[keyIndex];
  if (baseBinding && baseBinding.type !== "none") {
    placements.push({
      text: baseBinding.label,
      x: keyWidth / 2,
      y: keyHeight / 2 + theme.typography.primaryLabelSize * 0.35,
      fontSize: theme.typography.primaryLabelSize,
      color: theme.colors.legendColors.primary,
      anchor: "middle",
      layerIndex: 0,
    });

    // Hold behavior (mod-tap / layer-tap) - top center
    if (
      baseBinding.holdLabel &&
      (baseBinding.type === "mod-tap" || baseBinding.type === "layer-tap")
    ) {
      placements.push({
        text: baseBinding.holdLabel,
        x: keyWidth / 2,
        y: pad + theme.typography.holdLabelSize,
        fontSize: theme.typography.holdLabelSize,
        color: theme.colors.legendColors.hold,
        anchor: "middle",
        layerIndex: 0,
        isHold: true,
      });
    }
  }

  // Corner positions for layers 1-4
  const cornerPositions: Array<{
    x: number;
    y: number;
    anchor: "start" | "end";
  }> = [
    { x: pad, y: pad + theme.typography.secondaryLabelSize, anchor: "start" }, // top-left (L1)
    { x: pad, y: keyHeight - pad, anchor: "start" }, // bottom-left (L2)
    { x: keyWidth - pad, y: keyHeight - pad, anchor: "end" }, // bottom-right (L3)
    {
      x: keyWidth - pad,
      y: pad + theme.typography.secondaryLabelSize,
      anchor: "end",
    }, // top-right (L4)
  ];

  for (let i = 1; i < Math.min(visibleLayers.length, 5); i++) {
    const layer = visibleLayers[i]!;
    const binding = layer.bindings[keyIndex];

    if (
      binding &&
      binding.type !== "transparent" &&
      binding.type !== "none" &&
      binding.label
    ) {
      const pos = cornerPositions[i - 1]!;
      const layerIdx = layers.indexOf(layer);

      placements.push({
        text: binding.label,
        x: pos.x,
        y: pos.y,
        fontSize: theme.typography.secondaryLabelSize,
        color: layerColors[layerIdx % layerColors.length]!,
        anchor: pos.anchor,
        layerIndex: layerIdx,
      });
    }
  }

  return placements;
}
