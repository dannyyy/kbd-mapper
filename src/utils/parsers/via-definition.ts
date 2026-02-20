import type { KeyPosition, PhysicalLayout } from '../../types/layout'
import type { ImportResult, ImportWarning } from '../../types/import'
import { generateId } from '../id'

/**
 * Parse a VIA/VIAL keyboard definition JSON file.
 *
 * VIA definitions embed KLE data inside layouts.keymap, with matrix
 * positions as key legends ("row,col"). This parser extracts the
 * physical layout from the embedded KLE data.
 *
 * Expected structure:
 * {
 *   "name": "My Keyboard",
 *   "vendorId": "0x4848",
 *   "productId": "0x0001",
 *   "matrix": { "rows": 5, "cols": 15 },
 *   "layouts": {
 *     "keymap": [
 *       [{ "c": "#aaa" }, "0,0", { "w": 1.5 }, "0,1", ...],
 *       ["1,0", "1,1", ...]
 *     ]
 *   }
 * }
 */
export function parseViaDefinition(content: string): ImportResult {
  const data = JSON.parse(content)
  const warnings: ImportWarning[] = []

  if (!data.layouts?.keymap || !Array.isArray(data.layouts.keymap)) {
    throw new Error('Invalid VIA definition: missing "layouts.keymap" array')
  }

  const kleData = data.layouts.keymap as unknown[][]
  const keys: KeyPosition[] = []

  // Parse the embedded KLE data (same delta-encoding scheme as KLE)
  let currentY = 0
  let currentX = 0
  let nextX = 0
  let nextY = 0
  let nextW = 1
  let nextH = 1
  let nextR = 0
  let nextRx = 0
  let nextRy = 0
  let isFirstRow = true

  for (const row of kleData) {
    if (!Array.isArray(row)) continue

    currentX = nextR !== 0 ? nextRx : 0
    if (!isFirstRow) {
      currentY += 1
    }
    isFirstRow = false

    for (const item of row) {
      if (typeof item === 'object' && item !== null && !Array.isArray(item)) {
        const props = item as Record<string, unknown>
        if ('x' in props && typeof props.x === 'number') nextX = props.x
        if ('y' in props && typeof props.y === 'number') nextY = props.y
        if ('w' in props && typeof props.w === 'number') nextW = props.w
        if ('h' in props && typeof props.h === 'number') nextH = props.h
        if ('r' in props && typeof props.r === 'number') nextR = props.r
        if ('rx' in props && typeof props.rx === 'number') {
          nextRx = props.rx
          currentX = nextRx
          currentY = nextRy
        }
        if ('ry' in props && typeof props.ry === 'number') {
          nextRy = props.ry
          currentX = nextRx
          currentY = nextRy
        }
      } else if (typeof item === 'string') {
        // VIA uses "row,col" as the legend, but we only care about position
        currentX += nextX
        currentY += nextY

        const keyPos: KeyPosition = {
          x: currentX,
          y: currentY,
        }

        if (nextW !== 1) keyPos.w = nextW
        if (nextH !== 1) keyPos.h = nextH
        if (nextR !== 0) {
          keyPos.r = nextR
          keyPos.rx = nextRx
          keyPos.ry = nextRy
        }

        // Skip encoder entries (legends starting with 'e')
        if (!item.match(/^e\d+$/)) {
          keys.push(keyPos)
        }

        currentX += nextW
        nextX = 0
        nextY = 0
        nextW = 1
        nextH = 1
      }
    }
  }

  if (keys.length === 0) {
    throw new Error('No keys found in VIA definition')
  }

  // Detect splits
  const splits = detectSplits(keys)

  const keyboardName = data.name as string | undefined

  const layout: PhysicalLayout = {
    id: generateId('layout'),
    name: keyboardName ?? `VIA Layout (${keys.length} keys)`,
    keys,
    ...(splits.length > 0 ? { splits } : {}),
    metadata: {
      source: 'user',
      tags: [`${keys.length}-key`, 'imported', 'via'],
    },
  }

  if (data.layouts?.labels) {
    warnings.push({
      type: 'unsupported-feature',
      message: 'Layout options (alternate layouts) are not imported',
      details: 'Only the default layout option is used',
    })
  }

  return {
    layout,
    warnings,
    metadata: {
      sourceFormat: 'via-definition',
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
