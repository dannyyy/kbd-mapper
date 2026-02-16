import type { PhysicalLayout } from '../../types/layout'

// Ferris Sweep: 34 keys, 3x5+2 per side, aggressive columnar stagger
const LEFT_STAGGER = [0.93, 0.31, 0, 0.28, 0.42]
const RIGHT_STAGGER = [0.42, 0.28, 0, 0.31, 0.93]

function leftKeys() {
  const keys: Array<{ x: number; y: number }> = []
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 5; col++) {
      keys.push({ x: col, y: row + LEFT_STAGGER[col]! })
    }
  }
  // 2 thumb keys
  keys.push({ x: 3.5, y: 3.75 }, { x: 4.5, y: 4.0 })
  return keys
}

function rightKeys() {
  const keys: Array<{ x: number; y: number }> = []
  const offset = 6
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 5; col++) {
      keys.push({ x: offset + col, y: row + RIGHT_STAGGER[col]! })
    }
  }
  keys.push({ x: offset - 0.5, y: 4.0 }, { x: offset + 0.5, y: 3.75 })
  return keys
}

export const sweep: PhysicalLayout = {
  id: 'sweep',
  name: 'Ferris Sweep',
  keys: [...leftKeys(), ...rightKeys()],
  splits: [17],
  metadata: {
    source: 'builtin',
    tags: ['split', 'minimal', '34-key', 'columnar'],
  },
}
