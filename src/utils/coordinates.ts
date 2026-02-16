import type { KeyPosition } from '../types/layout'
import type { Theme } from '../types/theme'

export function keyToPixel(
  key: KeyPosition,
  theme: Theme,
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
  splits?: number[],
): { minX: number; minY: number; width: number; height: number } {
  const unit = theme.layout.keyUnit
  const gap = theme.layout.keyGap
  const effectiveUnit = unit + gap
  const splitGap = theme.layout.splitGap

  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  let maxY = -Infinity

  function expand(x: number, y: number) {
    if (x < minX) minX = x
    if (y < minY) minY = y
    if (x > maxX) maxX = x
    if (y > maxY) maxY = y
  }

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]!
    const kx = key.x * effectiveUnit + getSplitOffset(i, splits, splitGap)
    const ky = key.y * effectiveUnit
    const kw = (key.w ?? 1) * unit + ((key.w ?? 1) - 1) * gap
    const kh = (key.h ?? 1) * unit + ((key.h ?? 1) - 1) * gap

    if (key.r) {
      const rad = (key.r * Math.PI) / 180
      const cos = Math.cos(rad)
      const sin = Math.sin(rad)
      // Pivot in local group space (matches keyTransform)
      const px = (key.rx ?? key.x) * effectiveUnit
      const py = (key.ry ?? key.y) * effectiveUnit

      // Key rect corners in local group space: (0,0) to (kw, kh)
      const localCorners: [number, number][] = [
        [0, 0],
        [kw, 0],
        [kw, kh],
        [0, kh],
      ]

      for (const [lx, ly] of localCorners) {
        // Rotate local corner around pivot, then translate to final SVG position
        const dx = lx - px
        const dy = ly - py
        const fx = kx + px + dx * cos - dy * sin
        const fy = ky + py + dx * sin + dy * cos
        expand(fx, fy)
      }
    } else {
      expand(kx, ky)
      expand(kx + kw, ky + kh)
    }
  }

  if (!isFinite(minX)) minX = 0
  if (!isFinite(minY)) minY = 0
  if (!isFinite(maxX)) maxX = 0
  if (!isFinite(maxY)) maxY = 0

  return { minX, minY, width: maxX - minX, height: maxY - minY }
}

export function getSplitOffset(
  keyIndex: number,
  splits: number[] | undefined,
  splitGap: number,
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
