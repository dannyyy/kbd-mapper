import type { PhysicalLayout } from '../../types/layout'

// Planck: 48 keys, 4x12 ortholinear grid
function planckKeys() {
  const keys: Array<{ x: number; y: number; w?: number }> = []
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 12; col++) {
      keys.push({ x: col, y: row })
    }
  }
  return keys
}

export const planck: PhysicalLayout = {
  id: 'planck',
  name: 'Planck',
  keys: planckKeys(),
  metadata: { source: 'builtin', tags: ['ortholinear', '48-key', 'grid'] },
}
