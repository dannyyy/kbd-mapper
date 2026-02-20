import type { KeyPosition, PhysicalLayout } from '../../types/layout'
import type { ImportResult } from '../../types/import'
import { generateId } from '../id'

/**
 * Parse a QMK info.json file to extract physical layout.
 *
 * Expected structure:
 * {
 *   "keyboard_name": "...",
 *   "layouts": {
 *     "LAYOUT": {
 *       "layout": [
 *         { "matrix": [0,0], "x": 0, "y": 0, "w": 1.5 },
 *         ...
 *       ]
 *     }
 *   }
 * }
 *
 * Unlike KLE, QMK info.json uses stateless absolute coordinates per key.
 */
export function parseQmkInfo(content: string): ImportResult {
  const data = JSON.parse(content)

  if (!data.layouts || typeof data.layouts !== 'object') {
    throw new Error('Invalid QMK info.json: missing "layouts" object')
  }

  // Pick the first available layout (or LAYOUT if it exists)
  const layoutNames = Object.keys(data.layouts)
  if (layoutNames.length === 0) {
    throw new Error('No layouts found in QMK info.json')
  }

  const preferredName =
    layoutNames.find((n) => n === 'LAYOUT') ??
    layoutNames.find((n) => n.startsWith('LAYOUT')) ??
    layoutNames[0]!

  const rawLayout = data.layouts[preferredName]
  if (!rawLayout?.layout || !Array.isArray(rawLayout.layout)) {
    throw new Error(`Invalid layout "${preferredName}" in QMK info.json`)
  }

  const keys: KeyPosition[] = (rawLayout.layout as Record<string, unknown>[]).map((entry) => {
    const pos: KeyPosition = {
      x: entry.x as number,
      y: entry.y as number,
    }
    if (entry.w !== undefined && entry.w !== 1) pos.w = entry.w as number
    if (entry.h !== undefined && entry.h !== 1) pos.h = entry.h as number
    if (entry.r !== undefined && entry.r !== 0) {
      pos.r = entry.r as number
      if (entry.rx !== undefined) pos.rx = entry.rx as number
      if (entry.ry !== undefined) pos.ry = entry.ry as number
    }
    return pos
  })

  if (keys.length === 0) {
    throw new Error('No keys found in QMK info.json layout')
  }

  // Detect splits using the same heuristic as KLE
  const splits = detectSplits(keys)

  const keyboardName = data.keyboard_name ?? data.keyboard ?? data.name
  const layout: PhysicalLayout = {
    id: generateId('layout'),
    name: keyboardName ? `${keyboardName}` : `QMK Layout (${keys.length} keys)`,
    keys,
    ...(splits.length > 0 ? { splits } : {}),
    metadata: {
      source: 'user',
      tags: [`${keys.length}-key`, 'imported', 'qmk'],
    },
  }

  return {
    layout,
    warnings: [],
    metadata: {
      sourceFormat: 'qmk-info',
      keyboardName,
    },
  }
}

function detectSplits(keys: KeyPosition[]): number[] {
  if (keys.length < 10) return []

  const sorted = keys
    .map((k, i) => ({ ...k, originalIndex: i }))
    .sort((a, b) => {
      const yDiff = a.y - b.y
      if (Math.abs(yDiff) > 0.3) return yDiff
      return a.x - b.x
    })

  const firstRowY = sorted[0]!.y
  const firstRow = sorted.filter((k) => Math.abs(k.y - firstRowY) < 0.5)
  if (firstRow.length < 4) return []

  let maxGap = 0
  let splitAfterX = 0
  for (let i = 1; i < firstRow.length; i++) {
    const gap = firstRow[i]!.x - (firstRow[i - 1]!.x + (firstRow[i - 1]!.w ?? 1))
    if (gap > maxGap) {
      maxGap = gap
      splitAfterX = firstRow[i - 1]!.x + (firstRow[i - 1]!.w ?? 1)
    }
  }

  if (maxGap < 1.5) return []

  const splitIndex = keys.findIndex((k) => k.x >= splitAfterX + maxGap * 0.5)
  if (splitIndex > 0 && splitIndex < keys.length) {
    return [splitIndex]
  }

  return []
}
