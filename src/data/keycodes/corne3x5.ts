import { key, mod, nav, fn, media, lt, none, trans } from './helpers'
import type { KeyBinding } from '../../types/keymap'

// Corne 3x5+3 default QWERTY: 36 keys
// Derived from Corne 3x6 without the outer pinky column on each side
// Left: 15 matrix (3 rows × 5 cols) + 3 thumb = 18
// Right: 15 matrix (3 rows × 5 cols) + 3 thumb = 18

// Layer 0: Base
export const corne3x5Base: KeyBinding[] = [
  // Left row 0
  key('Q'),
  key('W'),
  key('E'),
  key('R'),
  key('T'),
  // Left row 1
  key('A'),
  key('S'),
  key('D'),
  key('F'),
  key('G'),
  // Left row 2
  key('Z'),
  key('X'),
  key('C'),
  key('V'),
  key('B'),
  // Left thumb
  mod('GUI'),
  lt('Bksp', 'L2'),
  lt('Spc', 'L3'),

  // Right row 0
  key('Y'),
  key('U'),
  key('I'),
  key('O'),
  key('P'),
  // Right row 1
  key('H'),
  key('J'),
  key('K'),
  key('L'),
  key("'"),
  // Right row 2
  key('N'),
  key('M'),
  key(','),
  key('.'),
  key('/'),
  // Right thumb
  lt('Ent', 'L4'),
  lt('Del', 'L2'),
  mod('Alt'),
]

// Layer 1: Shift
export const corne3x5Shift: KeyBinding[] = [
  // Left row 0
  key('Q'),
  key('W'),
  key('E'),
  key('R'),
  key('T'),
  // Left row 1
  key('A'),
  key('S'),
  key('D'),
  key('F'),
  key('G'),
  // Left row 2
  key('Z'),
  key('X'),
  key('C'),
  key('V'),
  key('B'),
  // Left thumb
  trans(),
  trans(),
  trans(),

  // Right row 0
  key('Y'),
  key('U'),
  key('I'),
  key('O'),
  key('P'),
  // Right row 1
  key('H'),
  key('J'),
  key('K'),
  key('L'),
  key('"'),
  // Right row 2
  key('N'),
  key('M'),
  key('<'),
  key('>'),
  key('?'),
  // Right thumb
  trans(),
  trans(),
  trans(),
]

// Layer 2: Lower/Symbols
export const corne3x5Lower: KeyBinding[] = [
  // Left row 0
  key('Esc'),
  key('@'),
  key('#'),
  key('$'),
  key('%'),
  // Left row 1
  key('Tab'),
  key('`'),
  key('~'),
  key('('),
  key(')'),
  // Left row 2
  none(),
  none(),
  none(),
  key('['),
  key(']'),
  // Left thumb
  trans(),
  trans(),
  trans(),

  // Right row 0
  key('^'),
  key('&'),
  key('*'),
  key('-'),
  key('='),
  // Right row 1
  nav('Left'),
  nav('Down'),
  nav('Up'),
  nav('Right'),
  key(';'),
  // Right row 2
  key('!'),
  key('{'),
  key('}'),
  key('<'),
  key('>'),
  // Right thumb
  trans(),
  trans(),
  trans(),
]

// Layer 3: Raise/Numbers
export const corne3x5Raise: KeyBinding[] = [
  // Left row 0
  key('1'),
  key('2'),
  key('3'),
  key('4'),
  key('5'),
  // Left row 1
  fn('F1'),
  fn('F2'),
  fn('F3'),
  fn('F4'),
  fn('F5'),
  // Left row 2
  fn('F7'),
  fn('F8'),
  fn('F9'),
  fn('F10'),
  fn('F11'),
  // Left thumb
  trans(),
  trans(),
  trans(),

  // Right row 0
  key('6'),
  key('7'),
  key('8'),
  key('9'),
  key('0'),
  // Right row 1
  fn('F6'),
  key('+'),
  key('|'),
  key('\\'),
  none(),
  // Right row 2
  fn('F12'),
  none(),
  none(),
  none(),
  none(),
  // Right thumb
  trans(),
  trans(),
  trans(),
]

// Layer 4: Nav
export const corne3x5Nav: KeyBinding[] = [
  // Left row 0
  none(),
  none(),
  none(),
  none(),
  none(),
  // Left row 1
  mod('Ctrl'),
  mod('Shift'),
  mod('Alt'),
  mod('GUI'),
  none(),
  // Left row 2
  none(),
  none(),
  none(),
  none(),
  none(),
  // Left thumb
  trans(),
  trans(),
  trans(),

  // Right row 0
  none(),
  nav('PgUp'),
  nav('Up'),
  nav('PgDn'),
  none(),
  // Right row 1
  nav('Home'),
  nav('Left'),
  nav('Down'),
  nav('Right'),
  nav('End'),
  // Right row 2
  none(),
  media('Vol-'),
  media('Mute'),
  media('Vol+'),
  none(),
  // Right thumb
  trans(),
  trans(),
  trans(),
]
