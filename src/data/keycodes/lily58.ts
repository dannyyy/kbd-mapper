import { key, mod, nav, fn, media, lt, none, trans } from "./helpers";
import type { KeyBinding } from "../../types/keymap";

// Lily58 default QWERTY keymap: 56 keys
// Based on the official QMK Lily58 default keymap
// Left: 24 matrix (4 rows x 6 cols, indices 0-23) + 4 thumb (indices 24-27) = 28
// Right: 24 matrix (4 rows x 6 cols, indices 28-51) + 4 thumb (indices 52-55) = 28

// Layer 0: Base
export const lily58Base: KeyBinding[] = [
  // Left row 0
  key("Esc"),
  key("1"),
  key("2"),
  key("3"),
  key("4"),
  key("5"),
  // Left row 1
  key("Tab"),
  key("Q"),
  key("W"),
  key("E"),
  key("R"),
  key("T"),
  // Left row 2
  mod("Ctrl"),
  key("A"),
  key("S"),
  key("D"),
  key("F"),
  key("G"),
  // Left row 3
  mod("Shift"),
  key("Z"),
  key("X"),
  key("C"),
  key("V"),
  key("B"),
  // Left thumb
  none(),
  mod("Alt"),
  mod("GUI"),
  lt("Spc", "L2"),

  // Right row 0
  key("6"),
  key("7"),
  key("8"),
  key("9"),
  key("0"),
  key("`"),
  // Right row 1
  key("Y"),
  key("U"),
  key("I"),
  key("O"),
  key("P"),
  key("-"),
  // Right row 2
  key("H"),
  key("J"),
  key("K"),
  key("L"),
  key(";"),
  key("'"),
  // Right row 3
  key("N"),
  key("M"),
  key(","),
  key("."),
  key("/"),
  mod("Shift"),
  // Right thumb
  lt("Ent", "L3"),
  key("Bksp"),
  mod("GUI"),
  none(),
];

// Layer 1: Shift
export const lily58Shift: KeyBinding[] = [
  // Left row 0
  trans(),
  key("!"),
  key("@"),
  key("#"),
  key("$"),
  key("%"),
  // Left row 1
  trans(),
  key("Q"),
  key("W"),
  key("E"),
  key("R"),
  key("T"),
  // Left row 2
  trans(),
  key("A"),
  key("S"),
  key("D"),
  key("F"),
  key("G"),
  // Left row 3
  trans(),
  key("Z"),
  key("X"),
  key("C"),
  key("V"),
  key("B"),
  // Left thumb
  trans(),
  trans(),
  trans(),
  trans(),

  // Right row 0
  key("^"),
  key("&"),
  key("*"),
  key("("),
  key(")"),
  key("~"),
  // Right row 1
  key("Y"),
  key("U"),
  key("I"),
  key("O"),
  key("P"),
  key("_"),
  // Right row 2
  key("H"),
  key("J"),
  key("K"),
  key("L"),
  key(":"),
  key('"'),
  // Right row 3
  key("N"),
  key("M"),
  key("<"),
  key(">"),
  key("?"),
  trans(),
  // Right thumb
  trans(),
  trans(),
  trans(),
  trans(),
];

// Layer 2: Lower
export const lily58Lower: KeyBinding[] = [
  // Left row 0
  trans(),
  trans(),
  trans(),
  trans(),
  trans(),
  trans(),
  // Left row 1
  fn("F1"),
  fn("F2"),
  fn("F3"),
  fn("F4"),
  fn("F5"),
  fn("F6"),
  // Left row 2
  key("`"),
  key("!"),
  key("@"),
  key("#"),
  key("$"),
  key("%"),
  // Left row 3
  trans(),
  none(),
  none(),
  none(),
  key("_"),
  key("+"),
  // Left thumb
  none(),
  trans(),
  trans(),
  trans(),

  // Right row 0
  trans(),
  trans(),
  trans(),
  trans(),
  trans(),
  trans(),
  // Right row 1
  fn("F7"),
  fn("F8"),
  fn("F9"),
  fn("F10"),
  fn("F11"),
  fn("F12"),
  // Right row 2
  key("^"),
  key("&"),
  key("*"),
  key("("),
  key(")"),
  key("~"),
  // Right row 3
  none(),
  none(),
  none(),
  key("{"),
  key("}"),
  key("|"),
  // Right thumb
  trans(),
  trans(),
  trans(),
  none(),
];

// Layer 3: Raise
export const lily58Raise: KeyBinding[] = [
  // Left row 0
  trans(),
  trans(),
  trans(),
  trans(),
  trans(),
  trans(),
  // Left row 1
  key("`"),
  key("1"),
  key("2"),
  key("3"),
  key("4"),
  key("5"),
  // Left row 2
  fn("F1"),
  fn("F2"),
  fn("F3"),
  fn("F4"),
  fn("F5"),
  fn("F6"),
  // Left row 3
  fn("F7"),
  fn("F8"),
  fn("F9"),
  fn("F10"),
  fn("F11"),
  fn("F12"),
  // Left thumb
  none(),
  trans(),
  trans(),
  trans(),

  // Right row 0
  trans(),
  trans(),
  trans(),
  trans(),
  trans(),
  trans(),
  // Right row 1
  key("6"),
  key("7"),
  key("8"),
  key("9"),
  key("0"),
  none(),
  // Right row 2
  none(),
  nav("Left"),
  nav("Down"),
  nav("Up"),
  nav("Right"),
  none(),
  // Right row 3
  key("+"),
  key("-"),
  key("="),
  key("["),
  key("]"),
  key("\\"),
  // Right thumb
  trans(),
  trans(),
  trans(),
  none(),
];

// Layer 4: Nav
export const lily58Nav: KeyBinding[] = [
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
  // Left thumb
  none(),
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
  nav("PgUp"),
  nav("Up"),
  nav("PgDn"),
  none(),
  none(),
  // Right row 2
  nav("Home"),
  nav("Left"),
  nav("Down"),
  nav("Right"),
  nav("End"),
  none(),
  // Right row 3
  none(),
  media("Vol-"),
  media("Mute"),
  media("Vol+"),
  none(),
  none(),
  // Right thumb
  trans(),
  trans(),
  trans(),
  none(),
];
