import { key, mod, nav, fn, media, lt, none, trans } from './helpers'
import type { KeyBinding } from '../../types/keymap'

// Layer 0: Base (QWERTY)
export const sweepBase: KeyBinding[] = [
  // Left side
  // Row 0 (0-4)
  key('Q'),
  key('W'),
  key('E'),
  key('R'),
  key('T'),
  // Row 1 (5-9)
  key('A'),
  key('S'),
  key('D'),
  key('F'),
  key('G'),
  // Row 2 (10-14)
  key('Z'),
  key('X'),
  key('C'),
  key('V'),
  key('B'),
  // Thumb (15-16)
  lt('Bksp', 'L2'),
  lt('Spc', 'L3'),

  // Right side
  // Row 0 (17-21)
  key('Y'),
  key('U'),
  key('I'),
  key('O'),
  key('P'),
  // Row 1 (22-26)
  key('H'),
  key('J'),
  key('K'),
  key('L'),
  key("'"),
  // Row 2 (27-31)
  key('N'),
  key('M'),
  key(','),
  key('.'),
  key('/'),
  // Thumb (32-33)
  lt('Ent', 'L4'),
  lt('Del', 'L2'),
]

// Layer 1: Shift
export const sweepShift: KeyBinding[] = [
  // Left side
  // Row 0 (0-4)
  key('Q'),
  key('W'),
  key('E'),
  key('R'),
  key('T'),
  // Row 1 (5-9)
  key('A'),
  key('S'),
  key('D'),
  key('F'),
  key('G'),
  // Row 2 (10-14)
  key('Z'),
  key('X'),
  key('C'),
  key('V'),
  key('B'),
  // Thumb (15-16)
  trans(),
  trans(),

  // Right side
  // Row 0 (17-21)
  key('Y'),
  key('U'),
  key('I'),
  key('O'),
  key('P'),
  // Row 1 (22-26)
  key('H'),
  key('J'),
  key('K'),
  key('L'),
  key('"'),
  // Row 2 (27-31)
  key('N'),
  key('M'),
  key('<'),
  key('>'),
  key('?'),
  // Thumb (32-33)
  trans(),
  trans(),
]

// Layer 2: Lower/Symbols
export const sweepLower: KeyBinding[] = [
  // Left side
  // Row 0 (0-4)
  key('Esc'),
  key('@'),
  key('#'),
  key('$'),
  key('%'),
  // Row 1 (5-9)
  key('Tab'),
  key('`'),
  key('~'),
  key('('),
  key(')'),
  // Row 2 (10-14)
  none(),
  none(),
  none(),
  key('['),
  key(']'),
  // Thumb (15-16)
  trans(),
  trans(),

  // Right side
  // Row 0 (17-21)
  key('^'),
  key('&'),
  key('*'),
  key('-'),
  key('='),
  // Row 1 (22-26)
  nav('Left'),
  nav('Down'),
  nav('Up'),
  nav('Right'),
  key(';'),
  // Row 2 (27-31)
  key('!'),
  key('{'),
  key('}'),
  key('+'),
  key('|'),
  // Thumb (32-33)
  trans(),
  trans(),
]

// Layer 3: Raise/Numbers
export const sweepRaise: KeyBinding[] = [
  // Left side
  // Row 0 (0-4)
  key('1'),
  key('2'),
  key('3'),
  key('4'),
  key('5'),
  // Row 1 (5-9)
  fn('F1'),
  fn('F2'),
  fn('F3'),
  fn('F4'),
  fn('F5'),
  // Row 2 (10-14)
  fn('F7'),
  fn('F8'),
  fn('F9'),
  fn('F10'),
  fn('F11'),
  // Thumb (15-16)
  trans(),
  trans(),

  // Right side
  // Row 0 (17-21)
  key('6'),
  key('7'),
  key('8'),
  key('9'),
  key('0'),
  // Row 1 (22-26)
  fn('F6'),
  key('\\'),
  none(),
  none(),
  none(),
  // Row 2 (27-31)
  fn('F12'),
  none(),
  none(),
  none(),
  none(),
  // Thumb (32-33)
  trans(),
  trans(),
]

// Layer 4: Nav
export const sweepNav: KeyBinding[] = [
  // Left side
  // Row 0 (0-4)
  none(),
  none(),
  none(),
  none(),
  none(),
  // Row 1 (5-9)
  mod('Ctrl'),
  mod('Shift'),
  mod('Alt'),
  mod('GUI'),
  none(),
  // Row 2 (10-14)
  none(),
  none(),
  none(),
  none(),
  none(),
  // Thumb (15-16)
  trans(),
  trans(),

  // Right side
  // Row 0 (17-21)
  none(),
  nav('PgUp'),
  nav('Up'),
  nav('PgDn'),
  none(),
  // Row 1 (22-26)
  nav('Home'),
  nav('Left'),
  nav('Down'),
  nav('Right'),
  nav('End'),
  // Row 2 (27-31)
  none(),
  media('Vol-'),
  media('Mute'),
  media('Vol+'),
  none(),
  // Thumb (32-33)
  trans(),
  trans(),
]
