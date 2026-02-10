import type { KeyPosition } from '../types/layout'
import type { Theme } from '../types/theme'

export function keyToPixel(
  key: KeyPosition,
  theme: Theme
): { x: number; y: number; width: number; height: number } {
  const unit = theme.layout.keyUnit
  const gap = theme.layout.keyGap
  const effectiveUnit = unit + gap

  return {
    x: key.x * effectiveUnit,
    y: key.y * effectiveUnit,
    width: (key.w ?? 1) * unit + ((key.w ?? 1) - 1) * gap,
    height: (key.h ?? 1) * unit + ((key.h ?? 1) - 1) * gap,
  }
}

export function keyTransform(key: KeyPosition, theme: Theme): string {
  if (!key.r) return ''
  const unit = theme.layout.keyUnit + theme.layout.keyGap
  const pivotX = (key.rx ?? key.x) * unit
  const pivotY = (key.ry ?? key.y) * unit
  return `rotate(${key.r}, ${pivotX}, ${pivotY})`
}

export function computeLayoutBounds(
  keys: KeyPosition[],
  theme: Theme,
  splits?: number[]
): { width: number; height: number } {
  const unit = theme.layout.keyUnit
  const gap = theme.layout.keyGap
  const effectiveUnit = unit + gap

  let maxX = 0
  let maxY = 0

  for (const key of keys) {
    const right = key.x * effectiveUnit + (key.w ?? 1) * unit + ((key.w ?? 1) - 1) * gap
    const bottom = key.y * effectiveUnit + (key.h ?? 1) * unit + ((key.h ?? 1) - 1) * gap
    if (right > maxX) maxX = right
    if (bottom > maxY) maxY = bottom
  }

  if (splits && splits.length > 0) {
    maxX += theme.layout.splitGap
  }

  return { width: maxX, height: maxY }
}

export function getSplitOffset(
  keyIndex: number,
  splits: number[] | undefined,
  splitGap: number
): number {
  if (!splits || splits.length === 0) return 0
  let offset = 0
  for (const splitIndex of splits) {
    if (keyIndex >= splitIndex) {
      offset += splitGap
    }
  }
  return offset
}
