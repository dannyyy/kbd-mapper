import { key, mod, nav, fn, media, lt, none, trans } from './helpers'
import type { KeyBinding } from '../../types/keymap'

export { key, mod, nav, fn, media, lt, none, trans } from './helpers'

// Corne 3x6+3 default QWERTY: 42 keys
// Left: 18 matrix + 3 thumb = 21
// Right: 18 matrix + 3 thumb = 21
export const corneQwertyBase: KeyBinding[] = [
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
  // Left thumb
  mod('GUI'),
  lt('Bksp', 'L2'),
  lt('Del', 'L3'),

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
  // Right thumb
  lt('Ent', 'L4'),
  lt('Spc', 'L2'),
  mod('Alt'),
]

export const corneShiftLayer: KeyBinding[] = [
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
  // Right thumb
  trans(),
  trans(),
  trans(),
]

export const corneSymbolLayer: KeyBinding[] = [
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
  key('+'),
  // Right row 1
  key('←'),
  key('↓'),
  key('↑'),
  key('→'),
  key(':'),
  key('"'),
  // Right row 2
  none(),
  key('{'),
  key('}'),
  key('<'),
  key('>'),
  key('?'),
  // Right thumb
  trans(),
  trans(),
  trans(),
]

export const corneNumberLayer: KeyBinding[] = [
  // Left row 0
  fn('F1'),
  fn('F2'),
  fn('F3'),
  fn('F4'),
  fn('F5'),
  fn('F6'),
  // Left row 1
  trans(),
  key('1'),
  key('2'),
  key('3'),
  key('4'),
  key('5'),
  // Left row 2
  trans(),
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
  fn('F7'),
  fn('F8'),
  fn('F9'),
  fn('F10'),
  fn('F11'),
  fn('F12'),
  // Right row 1
  key('6'),
  key('7'),
  key('8'),
  key('9'),
  key('0'),
  none(),
  // Right row 2
  none(),
  none(),
  none(),
  key('.'),
  none(),
  trans(),
  // Right thumb
  trans(),
  trans(),
  trans(),
]

export const corneNavLayer: KeyBinding[] = [
  // Left row 0
  none(),
  none(),
  none(),
  none(),
  none(),
  none(),
  // Left row 1
  trans(),
  none(),
  none(),
  none(),
  none(),
  none(),
  // Left row 2
  trans(),
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
  // Right thumb
  trans(),
  trans(),
  trans(),
]

// All available keycodes for the autocomplete catalog
export const keycodeCatalog = {
  letters: 'A B C D E F G H I J K L M N O P Q R S T U V W X Y Z'.split(' '),
  numbers: '0 1 2 3 4 5 6 7 8 9'.split(' '),
  symbols: '! @ # $ % ^ & * ( ) - = + [ ] { } \\ | ; : \' " , . / < > ? ` ~'.split(' '),
  modifiers: ['Ctrl', 'Shift', 'Alt', 'GUI', 'Hyper', 'Meh'],
  navigation: ['Up', 'Down', 'Left', 'Right', 'Home', 'End', 'PgUp', 'PgDn', 'Ins'],
  editing: ['Bksp', 'Del', 'Ent', 'Spc', 'Tab', 'Esc', 'CapsLk'],
  function: Array.from({ length: 24 }, (_, i) => `F${i + 1}`),
  media: ['Play', 'Pause', 'Stop', 'Next', 'Prev', 'Vol+', 'Vol-', 'Mute', 'Eject'],
  layer: ['L0', 'L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7'],
}
