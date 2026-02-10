import type { PhysicalLayout } from '../../types/layout'

// ANSI 60%: 61 keys traditional staggered layout
function ansi60Keys() {
  const keys: Array<{ x: number; y: number; w?: number }> = []

  // Row 0: number row (14 keys)
  for (let i = 0; i < 13; i++) keys.push({ x: i, y: 0 })
  keys.push({ x: 13, y: 0, w: 2 }) // Backspace

  // Row 1: QWERTY row
  keys.push({ x: 0, y: 1, w: 1.5 }) // Tab
  for (let i = 0; i < 12; i++) keys.push({ x: 1.5 + i, y: 1 })
  keys.push({ x: 13.5, y: 1, w: 1.5 }) // Backslash

  // Row 2: Home row
  keys.push({ x: 0, y: 2, w: 1.75 }) // Caps Lock
  for (let i = 0; i < 11; i++) keys.push({ x: 1.75 + i, y: 2 })
  keys.push({ x: 12.75, y: 2, w: 2.25 }) // Enter

  // Row 3: Bottom row
  keys.push({ x: 0, y: 3, w: 2.25 }) // Left Shift
  for (let i = 0; i < 10; i++) keys.push({ x: 2.25 + i, y: 3 })
  keys.push({ x: 12.25, y: 3, w: 2.75 }) // Right Shift

  // Row 4: Space row
  keys.push({ x: 0, y: 4, w: 1.25 })    // Left Ctrl
  keys.push({ x: 1.25, y: 4, w: 1.25 })  // Left GUI
  keys.push({ x: 2.5, y: 4, w: 1.25 })   // Left Alt
  keys.push({ x: 3.75, y: 4, w: 6.25 })  // Space
  keys.push({ x: 10, y: 4, w: 1.25 })    // Right Alt
  keys.push({ x: 11.25, y: 4, w: 1.25 }) // Right GUI
  keys.push({ x: 12.5, y: 4, w: 1.25 })  // Menu
  keys.push({ x: 13.75, y: 4, w: 1.25 }) // Right Ctrl

  return keys
}

export const ansi60: PhysicalLayout = {
  id: 'ansi-60',
  name: 'ANSI 60%',
  keys: ansi60Keys(),
  metadata: { source: 'builtin', tags: ['traditional', '61-key', 'staggered'] },
}
