import type { PhysicalLayout } from '../../types/layout'

// ANSI TKL: 87 keys
function ansiTklKeys() {
  const keys: Array<{ x: number; y: number; w?: number }> = []

  // Row 0: Function row
  keys.push({ x: 0, y: 0 }) // Esc
  // Gap
  keys.push({ x: 2, y: 0 }) // F1
  keys.push({ x: 3, y: 0 }) // F2
  keys.push({ x: 4, y: 0 }) // F3
  keys.push({ x: 5, y: 0 }) // F4
  // Gap
  keys.push({ x: 6.5, y: 0 }) // F5
  keys.push({ x: 7.5, y: 0 }) // F6
  keys.push({ x: 8.5, y: 0 }) // F7
  keys.push({ x: 9.5, y: 0 }) // F8
  // Gap
  keys.push({ x: 11, y: 0 }) // F9
  keys.push({ x: 12, y: 0 }) // F10
  keys.push({ x: 13, y: 0 }) // F11
  keys.push({ x: 14, y: 0 }) // F12
  // Nav cluster
  keys.push({ x: 15.5, y: 0 }) // PrtSc
  keys.push({ x: 16.5, y: 0 }) // ScrLk
  keys.push({ x: 17.5, y: 0 }) // Pause

  // Row 1: Number row (gap between function and number row = 0.5u)
  const r1y = 1.5
  for (let i = 0; i < 13; i++) keys.push({ x: i, y: r1y })
  keys.push({ x: 13, y: r1y, w: 2 }) // Backspace
  keys.push({ x: 15.5, y: r1y }) // Ins
  keys.push({ x: 16.5, y: r1y }) // Home
  keys.push({ x: 17.5, y: r1y }) // PgUp

  // Row 2: QWERTY
  const r2y = 2.5
  keys.push({ x: 0, y: r2y, w: 1.5 }) // Tab
  for (let i = 0; i < 12; i++) keys.push({ x: 1.5 + i, y: r2y })
  keys.push({ x: 13.5, y: r2y, w: 1.5 }) // Backslash
  keys.push({ x: 15.5, y: r2y }) // Del
  keys.push({ x: 16.5, y: r2y }) // End
  keys.push({ x: 17.5, y: r2y }) // PgDn

  // Row 3: Home row
  const r3y = 3.5
  keys.push({ x: 0, y: r3y, w: 1.75 }) // Caps
  for (let i = 0; i < 11; i++) keys.push({ x: 1.75 + i, y: r3y })
  keys.push({ x: 12.75, y: r3y, w: 2.25 }) // Enter

  // Row 4: Bottom alpha
  const r4y = 4.5
  keys.push({ x: 0, y: r4y, w: 2.25 }) // LShift
  for (let i = 0; i < 10; i++) keys.push({ x: 2.25 + i, y: r4y })
  keys.push({ x: 12.25, y: r4y, w: 2.75 }) // RShift
  keys.push({ x: 16.5, y: r4y }) // Up

  // Row 5: Bottom
  const r5y = 5.5
  keys.push({ x: 0, y: r5y, w: 1.25 })    // LCtrl
  keys.push({ x: 1.25, y: r5y, w: 1.25 })  // LGUI
  keys.push({ x: 2.5, y: r5y, w: 1.25 })   // LAlt
  keys.push({ x: 3.75, y: r5y, w: 6.25 })  // Space
  keys.push({ x: 10, y: r5y, w: 1.25 })    // RAlt
  keys.push({ x: 11.25, y: r5y, w: 1.25 }) // RGUI
  keys.push({ x: 12.5, y: r5y, w: 1.25 })  // Menu
  keys.push({ x: 13.75, y: r5y, w: 1.25 }) // RCtrl
  keys.push({ x: 15.5, y: r5y }) // Left
  keys.push({ x: 16.5, y: r5y }) // Down
  keys.push({ x: 17.5, y: r5y }) // Right

  return keys
}

export const ansiTkl: PhysicalLayout = {
  id: 'ansi-tkl',
  name: 'ANSI TKL',
  keys: ansiTklKeys(),
  metadata: { source: 'builtin', tags: ['traditional', '87-key', 'staggered', 'tenkeyless'] },
}
