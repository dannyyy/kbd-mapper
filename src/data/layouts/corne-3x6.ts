import type { PhysicalLayout } from '../../types/layout'

// Corne 3x6+3: 42-key split ergonomic
// Left half: 3 rows x 6 cols + 3 thumb keys
// Right half: 3 rows x 6 cols + 3 thumb keys
// Columnar stagger applied to each column

const LEFT_STAGGER = [0, 0, -0.125, -0.25, -0.125, 0]
const RIGHT_STAGGER = [0, -0.125, -0.25, -0.125, 0, 0]

function leftKeys(): Array<{ x: number; y: number; w?: number; h?: number; r?: number; rx?: number; ry?: number }> {
  const keys: Array<{ x: number; y: number }> = []

  // 3 rows x 6 columns
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 6; col++) {
      keys.push({
        x: col,
        y: row + LEFT_STAGGER[col],
      })
    }
  }

  // 3 thumb keys (fanned slightly)
  keys.push(
    { x: 3, y: 3.25 },
    { x: 4, y: 3.0 },
    { x: 5, y: 2.75 },
  )

  return keys
}

function rightKeys(): Array<{ x: number; y: number; w?: number; h?: number; r?: number; rx?: number; ry?: number }> {
  const keys: Array<{ x: number; y: number }> = []
  const offset = 7 // 6 cols + 1 unit split gap (handled by splits)

  // 3 rows x 6 columns
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 6; col++) {
      keys.push({
        x: offset + col,
        y: row + RIGHT_STAGGER[col],
      })
    }
  }

  // 3 thumb keys (fanned)
  keys.push(
    { x: offset, y: 2.75 },
    { x: offset + 1, y: 3.0 },
    { x: offset + 2, y: 3.25 },
  )

  return keys
}

export const corne3x6: PhysicalLayout = {
  id: 'corne-3x6',
  name: 'Corne 3×6+3',
  keys: [...leftKeys(), ...rightKeys()],
  splits: [21], // Right half starts at index 21
  metadata: {
    source: 'builtin',
    tags: ['split', 'ergonomic', '42-key', 'columnar'],
  },
}
