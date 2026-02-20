import type { KeyPosition, PhysicalLayout } from '../../types/layout'
import type { ImportResult } from '../../types/import'
import { generateId } from '../id'

/**
 * Parse KLE (keyboard-layout-editor.com) JSON format.
 *
 * KLE uses a delta-encoding scheme: properties set via JSON objects
 * before key strings modify subsequent keys. Some properties persist
 * across keys (color, text settings), others reset per-key (x, y offsets).
 *
 * This parser extracts physical key positions. Labels are not imported
 * as bindings since KLE labels are purely visual.
 */
export function parseKle(content: string): ImportResult {
  const data = JSON.parse(content)

  if (!Array.isArray(data)) {
    throw new Error('Invalid KLE format: expected a JSON array')
  }

  const keys: KeyPosition[] = []
  let startIndex = 0

  // First element may be metadata object (not an array)
  let keyboardName: string | undefined
  if (data.length > 0 && !Array.isArray(data[0]) && typeof data[0] === 'object') {
    const meta = data[0] as Record<string, unknown>
    keyboardName = meta.name as string | undefined
    startIndex = 1
  }

  // Current position state
  let currentY = 0
  let currentX = 0

  // Per-key properties (reset after each key)
  let nextX = 0
  let nextY = 0
  let nextW = 1
  let nextH = 1
  let nextR = 0
  let nextRx = 0
  let nextRy = 0

  for (let rowIdx = startIndex; rowIdx < data.length; rowIdx++) {
    const row = data[rowIdx]
    if (!Array.isArray(row)) continue

    // Each row resets X position and increments Y
    currentX = 0
    if (rowIdx > startIndex) {
      currentY += 1
    }

    for (const item of row) {
      if (typeof item === 'object' && !Array.isArray(item)) {
        // Property object — modify state for the next key(s)
        const props = item as Record<string, unknown>

        if ('x' in props && typeof props.x === 'number') nextX = props.x
        if ('y' in props && typeof props.y === 'number') nextY = props.y
        if ('w' in props && typeof props.w === 'number') nextW = props.w
        if ('h' in props && typeof props.h === 'number') nextH = props.h
        if ('r' in props && typeof props.r === 'number') nextR = props.r
        if ('rx' in props && typeof props.rx === 'number') {
          nextRx = props.rx
          // When rx changes, reset x position to rx
          currentX = nextRx
          currentY = nextRy
        }
        if ('ry' in props && typeof props.ry === 'number') {
          nextRy = props.ry
          // When ry changes, reset y position to ry
          currentX = nextRx
          currentY = nextRy
        }
      } else if (typeof item === 'string') {
        // Key entry — apply accumulated offsets
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

        keys.push(keyPos)

        // Advance X by key width
        currentX += nextW

        // Reset per-key properties
        nextX = 0
        nextY = 0
        nextW = 1
        nextH = 1
        // Note: r, rx, ry persist across keys (they don't reset per-key)
      }
    }
  }

  if (keys.length === 0) {
    throw new Error('No keys found in KLE data')
  }

  // Detect splits: look for large horizontal gaps
  const splits = detectSplits(keys)

  const layout: PhysicalLayout = {
    id: generateId('layout'),
    name: keyboardName ?? `KLE Layout (${keys.length} keys)`,
    keys,
    ...(splits.length > 0 ? { splits } : {}),
    metadata: {
      source: 'user',
      tags: [`${keys.length}-key`, 'imported', 'kle'],
    },
  }

  return {
    layout,
    warnings: [],
    metadata: {
      sourceFormat: 'kle',
      keyboardName,
    },
  }
}

/**
 * Detect split boundaries by finding large horizontal gaps between
 * consecutive keys (sorted by x position within similar y ranges).
 */
function detectSplits(keys: KeyPosition[]): number[] {
  if (keys.length < 10) return []

  // Sort keys by position (top-to-bottom, left-to-right)
  const sorted = keys
    .map((k, i) => ({ ...k, originalIndex: i }))
    .sort((a, b) => {
      const yDiff = a.y - b.y
      if (Math.abs(yDiff) > 0.3) return yDiff
      return a.x - b.x
    })

  // Find the largest horizontal gap in the first row
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

  // Only consider it a split if the gap is significantly larger than normal key gaps
  if (maxGap < 1.5) return []

  // The split index is the first key to the right of the gap
  const splitIndex = keys.findIndex((k) => k.x >= splitAfterX + maxGap * 0.5)
  if (splitIndex > 0 && splitIndex < keys.length) {
    return [splitIndex]
  }

  return []
}
