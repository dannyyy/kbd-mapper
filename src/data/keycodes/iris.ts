import { key, mod, nav, fn, media, lt, none, trans } from './helpers'
import type { KeyBinding } from '../../types/keymap'

// Iris default QWERTY keymap: 56 keys
// Based on the official QMK Iris default keymap
// Left: 24 matrix (4 rows x 6 cols) + 1 inner + 3 thumb = 28
// Right: 24 matrix (4 rows x 6 cols) + 1 inner + 3 thumb = 28

// Layer 0: Base
export const irisBase: KeyBinding[] = [
  // Left row 0
  key('Esc'),
  key('1'),
  key('2'),
  key('3'),
  key('4'),
  key('5'),
  // Left row 1
  key('Tab'),
  key('Q'),
  key('W'),
  key('E'),
  key('R'),
  key('T'),
  // Left row 2
  mod('Ctrl'),
  key('A'),
  key('S'),
  key('D'),
  key('F'),
  key('G'),
  // Left row 3
  mod('Shift'),
  key('Z'),
  key('X'),
  key('C'),
  key('V'),
  key('B'),
  // Left inner
  nav('Home'),
  // Left thumb
  mod('GUI'),
  lt('Ent', 'L1'),
  key('Ent'),

  // Right row 0
  key('6'),
  key('7'),
  key('8'),
  key('9'),
  key('0'),
  key('Bksp'),
  // Right row 1
  key('Y'),
  key('U'),
  key('I'),
  key('O'),
  key('P'),
  key('Del'),
  // Right row 2
  key('H'),
  key('J'),
  key('K'),
  key('L'),
  key(';'),
  key("'"),
  // Right row 3
  key('N'),
  key('M'),
  key(','),
  key('.'),
  key('/'),
  mod('Shift'),
  // Right inner
  nav('End'),
  // Right thumb
  key('Spc'),
  lt('Spc', 'L2'),
  mod('Alt'),
]

// Layer 1: Lower (symbols + numpad)
export const irisLower: KeyBinding[] = [
  // Left row 0
  key('~'),
  key('!'),
  key('@'),
  key('#'),
  key('$'),
  key('%'),
  // Left row 1
  key('`'),
  trans(),
  nav('Up'),
  trans(),
  none(),
  trans(),
  // Left row 2
  key('Del'),
  nav('Left'),
  nav('Down'),
  nav('Right'),
  trans(),
  key('['),
  // Left row 3
  trans(),
  none(),
  trans(),
  trans(),
  trans(),
  key('{'),
  // Left inner
  key('('),
  // Left thumb
  trans(),
  trans(),
  key('Del'),

  // Right row 0
  key('^'),
  key('&'),
  key('*'),
  key('('),
  key(')'),
  nav('PgUp'),
  // Right row 1
  trans(),
  key('7'),
  key('8'),
  key('9'),
  key('0'),
  nav('PgDn'),
  // Right row 2
  key(']'),
  key('4'),
  key('5'),
  key('6'),
  key('+'),
  key('|'),
  // Right row 3
  key('}'),
  key('1'),
  key('2'),
  key('3'),
  key('-'),
  trans(),
  // Right inner
  key(')'),
  // Right thumb
  key('Del'),
  trans(),
  key('0'),
]

// Layer 2: Raise (F-keys + media + symbols)
export const irisRaise: KeyBinding[] = [
  // Left row 0
  fn('F12'),
  fn('F1'),
  fn('F2'),
  fn('F3'),
  fn('F4'),
  fn('F5'),
  // Left row 1
  trans(),
  key('!'),
  key('@'),
  key('#'),
  key('$'),
  key('%'),
  // Left row 2
  trans(),
  media('Prev'),
  media('Next'),
  media('Vol+'),
  nav('PgUp'),
  key('_'),
  // Left row 3
  media('Mute'),
  media('Stop'),
  media('Play'),
  media('Vol-'),
  nav('PgDn'),
  key('-'),
  // Left inner
  key('('),
  // Left thumb
  trans(),
  trans(),
  trans(),

  // Right row 0
  fn('F6'),
  fn('F7'),
  fn('F8'),
  fn('F9'),
  fn('F10'),
  fn('F11'),
  // Right row 1
  key('^'),
  key('&'),
  key('*'),
  key('('),
  key(')'),
  none(),
  // Right row 2
  key('='),
  nav('Home'),
  trans(),
  trans(),
  trans(),
  key('\\'),
  // Right row 3
  key('+'),
  nav('End'),
  trans(),
  trans(),
  trans(),
  none(),
  // Right inner
  trans(),
  // Right thumb
  trans(),
  trans(),
  trans(),
]

// Layer 3: Shift
export const irisShift: KeyBinding[] = [
  // Left row 0
  trans(),
  key('!'),
  key('@'),
  key('#'),
  key('$'),
  key('%'),
  // Left row 1
  trans(),
  key('Q'),
  key('W'),
  key('E'),
  key('R'),
  key('T'),
  // Left row 2
  trans(),
  key('A'),
  key('S'),
  key('D'),
  key('F'),
  key('G'),
  // Left row 3
  trans(),
  key('Z'),
  key('X'),
  key('C'),
  key('V'),
  key('B'),
  // Left inner
  trans(),
  // Left thumb
  trans(),
  trans(),
  trans(),

  // Right row 0
  key('^'),
  key('&'),
  key('*'),
  key('('),
  key(')'),
  trans(),
  // Right row 1
  key('Y'),
  key('U'),
  key('I'),
  key('O'),
  key('P'),
  trans(),
  // Right row 2
  key('H'),
  key('J'),
  key('K'),
  key('L'),
  key(':'),
  key('"'),
  // Right row 3
  key('N'),
  key('M'),
  key('<'),
  key('>'),
  key('?'),
  trans(),
  // Right inner
  trans(),
  // Right thumb
  trans(),
  trans(),
  trans(),
]

// Layer 4: Nav
export const irisNav: KeyBinding[] = [
  // Left row 0
  none(),
  none(),
  none(),
  none(),
  none(),
  none(),
  // Left row 1
  none(),
  none(),
  none(),
  none(),
  none(),
  none(),
  // Left row 2
  none(),
  none(),
  none(),
  none(),
  none(),
  none(),
  // Left row 3
  none(),
  none(),
  none(),
  none(),
  none(),
  none(),
  // Left inner
  none(),
  // Left thumb
  trans(),
  trans(),
  trans(),

  // Right row 0
  none(),
  none(),
  none(),
  none(),
  none(),
  none(),
  // Right row 1
  none(),
  nav('PgUp'),
  nav('Up'),
  nav('PgDn'),
  none(),
  none(),
  // Right row 2
  nav('Home'),
  nav('Left'),
  nav('Down'),
  nav('Right'),
  nav('End'),
  none(),
  // Right row 3
  none(),
  media('Vol-'),
  media('Mute'),
  media('Vol+'),
  none(),
  none(),
  // Right inner
  none(),
  // Right thumb
  trans(),
  trans(),
  trans(),
]
