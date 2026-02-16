import { key, mod, nav, fn, media, lt, none, trans } from './helpers'
import type { KeyBinding } from '../../types/keymap'

// Kyria default QWERTY: 50 keys
// Left: 18 matrix (3 rows × 6 cols) + 2 inner + 5 thumb = 25
// Right: 18 matrix (3 rows × 6 cols) + 2 inner + 5 thumb = 25

// Layer 0: Base
export const kyriaBase: KeyBinding[] = [
  // Left row 0
  key('Tab'),
  key('Q'),
  key('W'),
  key('E'),
  key('R'),
  key('T'),
  // Left row 1
  mod('Ctrl'),
  key('A'),
  key('S'),
  key('D'),
  key('F'),
  key('G'),
  // Left row 2
  mod('Shift'),
  key('Z'),
  key('X'),
  key('C'),
  key('V'),
  key('B'),
  // Left inner keys
  key('['),
  key(']'),
  // Left thumb
  none(),
  mod('GUI'),
  mod('Alt'),
  lt('Spc', 'L2'),
  lt('Tab', 'L3'),

  // Right row 0
  key('Y'),
  key('U'),
  key('I'),
  key('O'),
  key('P'),
  key('\\'),
  // Right row 1
  key('H'),
  key('J'),
  key('K'),
  key('L'),
  key(';'),
  key("'"),
  // Right row 2
  key('N'),
  key('M'),
  key(','),
  key('.'),
  key('/'),
  mod('Shift'),
  // Right inner keys
  key('-'),
  key('='),
  // Right thumb
  lt('Bksp', 'L4'),
  lt('Ent', 'L2'),
  mod('Alt'),
  mod('GUI'),
  none(),
]

// Layer 1: Shift
export const kyriaShift: KeyBinding[] = [
  // Left row 0
  trans(),
  key('Q'),
  key('W'),
  key('E'),
  key('R'),
  key('T'),
  // Left row 1
  trans(),
  key('A'),
  key('S'),
  key('D'),
  key('F'),
  key('G'),
  // Left row 2
  trans(),
  key('Z'),
  key('X'),
  key('C'),
  key('V'),
  key('B'),
  // Left inner keys
  key('{'),
  key('}'),
  // Left thumb
  trans(),
  trans(),
  trans(),
  trans(),
  trans(),

  // Right row 0
  key('Y'),
  key('U'),
  key('I'),
  key('O'),
  key('P'),
  key('|'),
  // Right row 1
  key('H'),
  key('J'),
  key('K'),
  key('L'),
  key(':'),
  key('"'),
  // Right row 2
  key('N'),
  key('M'),
  key('<'),
  key('>'),
  key('?'),
  trans(),
  // Right inner keys
  key('_'),
  key('+'),
  // Right thumb
  trans(),
  trans(),
  trans(),
  trans(),
  trans(),
]

// Layer 2: Lower/Symbols
export const kyriaLower: KeyBinding[] = [
  // Left row 0
  key('Esc'),
  key('!'),
  key('@'),
  key('#'),
  key('$'),
  key('%'),
  // Left row 1
  trans(),
  key('`'),
  key('~'),
  key('('),
  key(')'),
  key('|'),
  // Left row 2
  trans(),
  none(),
  none(),
  key('['),
  key(']'),
  none(),
  // Left inner keys
  none(),
  none(),
  // Left thumb
  none(),
  trans(),
  trans(),
  trans(),
  trans(),

  // Right row 0
  key('^'),
  key('&'),
  key('*'),
  key('-'),
  key('='),
  key('+'),
  // Right row 1
  nav('Left'),
  nav('Down'),
  nav('Up'),
  nav('Right'),
  key(':'),
  key('"'),
  // Right row 2
  none(),
  key('{'),
  key('}'),
  key('<'),
  key('>'),
  key('?'),
  // Right inner keys
  none(),
  none(),
  // Right thumb
  trans(),
  trans(),
  trans(),
  trans(),
  none(),
]

// Layer 3: Raise/Numbers
export const kyriaRaise: KeyBinding[] = [
  // Left row 0
  none(),
  key('1'),
  key('2'),
  key('3'),
  key('4'),
  key('5'),
  // Left row 1
  trans(),
  fn('F1'),
  fn('F2'),
  fn('F3'),
  fn('F4'),
  fn('F5'),
  // Left row 2
  trans(),
  fn('F7'),
  fn('F8'),
  fn('F9'),
  fn('F10'),
  fn('F11'),
  // Left inner keys
  none(),
  none(),
  // Left thumb
  none(),
  trans(),
  trans(),
  trans(),
  trans(),

  // Right row 0
  key('6'),
  key('7'),
  key('8'),
  key('9'),
  key('0'),
  none(),
  // Right row 1
  fn('F6'),
  none(),
  none(),
  none(),
  none(),
  none(),
  // Right row 2
  fn('F12'),
  none(),
  none(),
  key('.'),
  none(),
  trans(),
  // Right inner keys
  none(),
  none(),
  // Right thumb
  trans(),
  trans(),
  trans(),
  trans(),
  none(),
]

// Layer 4: Nav
export const kyriaNav: KeyBinding[] = [
  // Left row 0
  none(),
  none(),
  none(),
  none(),
  none(),
  none(),
  // Left row 1
  trans(),
  mod('Ctrl'),
  mod('Shift'),
  mod('Alt'),
  mod('GUI'),
  none(),
  // Left row 2
  trans(),
  none(),
  none(),
  none(),
  none(),
  none(),
  // Left inner keys
  none(),
  none(),
  // Left thumb
  none(),
  trans(),
  trans(),
  trans(),
  trans(),

  // Right row 0
  none(),
  nav('PgUp'),
  nav('Up'),
  nav('PgDn'),
  none(),
  none(),
  // Right row 1
  nav('Home'),
  nav('Left'),
  nav('Down'),
  nav('Right'),
  nav('End'),
  none(),
  // Right row 2
  none(),
  media('Vol-'),
  media('Mute'),
  media('Vol+'),
  none(),
  trans(),
  // Right inner keys
  none(),
  none(),
  // Right thumb
  trans(),
  trans(),
  trans(),
  trans(),
  none(),
]
