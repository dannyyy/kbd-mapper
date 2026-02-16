import type { PhysicalLayout } from '../../types/layout'

// Iris SE / CE / LM: 56 keys, split ergonomic 4x6+4 per side
// All three Iris variants share the same physical key layout.
// Columnar stagger matching Ergodox-style offsets from QMK
const LEFT_STAGGER = [0, 0, -0.25, -0.375, -0.25, -0.125]
const RIGHT_STAGGER = [-0.125, -0.25, -0.375, -0.25, 0, 0]

function leftKeys() {
  const keys: Array<{ x: number; y: number }> = []
  // 4 rows x 6 cols
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 6; col++) {
      keys.push({ x: col, y: row + LEFT_STAGGER[col]! })
    }
  }
  // 2 inner keys (encoder area positions)
  keys.push({ x: 6.15, y: 3.75 })
  // 3 thumb keys (fanning down-right)
  keys.push({ x: 3.5, y: 4.25 }, { x: 4.5, y: 4.375 }, { x: 5.6, y: 4.75 })
  return keys
}

function rightKeys() {
  const keys: Array<{ x: number; y: number }> = []
  const offset = 9
  // 4 rows x 6 cols
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 6; col++) {
      keys.push({ x: offset + col, y: row + RIGHT_STAGGER[col]! })
    }
  }
  // 1 inner key (encoder area, mirrored)
  keys.push({ x: 7.85, y: 3.75 })
  // 3 thumb keys (fanning down-left, mirrored)
  keys.push({ x: 8.4, y: 4.75 }, { x: 9.5, y: 4.375 }, { x: 10.5, y: 4.25 })
  return keys
}

export const iris: PhysicalLayout = {
  id: 'iris',
  name: 'Iris SE / CE / LM',
  keys: [...leftKeys(), ...rightKeys()],
  splits: [28],
  metadata: {
    source: 'builtin',
    tags: ['split', 'ergonomic', '56-key', 'columnar'],
  },
}
