import type { PhysicalLayout } from '../../types/layout'

// Kyria: 50 keys, split ergonomic 3x6+2+5 per side
// Based on QMK LAYOUT_split_3x6_5
// Column stagger: outer pinky +0.75, pinky +0.75, ring +0.25, middle 0, index +0.25, inner +0.5
const LEFT_STAGGER = [0.75, 0.75, 0.25, 0, 0.25, 0.5]
const RIGHT_STAGGER = [0.5, 0.25, 0, 0.25, 0.75, 0.75]

function leftKeys() {
  const keys: Array<{ x: number; y: number }> = []

  // 3 rows x 6 cols
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 6; col++) {
      keys.push({ x: col, y: row + LEFT_STAGGER[col]! })
    }
  }

  // 2 extra inner keys on bottom row (stepping down toward center)
  keys.push({ x: 6, y: 3.0 }, { x: 7, y: 3.25 })

  // 5 thumb keys (fanned arc, stepping down/right)
  keys.push(
    { x: 2.5, y: 3.25 },
    { x: 3.5, y: 3.25 },
    { x: 4.5, y: 3.5 },
    { x: 5.5, y: 4.0 },
    { x: 6.5, y: 4.25 },
  )

  return keys
}

function rightKeys() {
  const keys: Array<{ x: number; y: number }> = []
  const offset = 10.5

  // 3 rows x 6 cols
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 6; col++) {
      keys.push({ x: offset + col, y: row + RIGHT_STAGGER[col]! })
    }
  }

  // 2 extra inner keys on bottom row (stepping down toward center, mirrored)
  keys.push({ x: offset - 2, y: 3.25 }, { x: offset - 1, y: 3.0 })

  // 5 thumb keys (fanned arc, mirrored)
  keys.push(
    { x: offset - 1.5, y: 4.25 },
    { x: offset - 0.5, y: 4.0 },
    { x: offset + 0.5, y: 3.5 },
    { x: offset + 1.5, y: 3.25 },
    { x: offset + 2.5, y: 3.25 },
  )

  return keys
}

export const kyria: PhysicalLayout = {
  id: 'kyria',
  name: 'Kyria',
  keys: [...leftKeys(), ...rightKeys()],
  splits: [25], // Left: 18 grid + 2 inner + 5 thumb = 25
  metadata: {
    source: 'builtin',
    tags: ['split', 'ergonomic', '50-key', 'encoders'],
  },
}
