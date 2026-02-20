import type { KeyType } from '../types/keymap'

export interface KeycodeEntry {
  label: string
  type: KeyType
}

/**
 * QMK keycode name → human-readable label + KeyType.
 * Covers all standard keycodes from QMK's keycode documentation.
 * Aliases (e.g. KC_LSHIFT → KC_LSFT) are included as separate entries.
 */
const QMK_KEYCODES: Record<string, KeycodeEntry> = {
  // Letters
  KC_A: { label: 'A', type: 'normal' },
  KC_B: { label: 'B', type: 'normal' },
  KC_C: { label: 'C', type: 'normal' },
  KC_D: { label: 'D', type: 'normal' },
  KC_E: { label: 'E', type: 'normal' },
  KC_F: { label: 'F', type: 'normal' },
  KC_G: { label: 'G', type: 'normal' },
  KC_H: { label: 'H', type: 'normal' },
  KC_I: { label: 'I', type: 'normal' },
  KC_J: { label: 'J', type: 'normal' },
  KC_K: { label: 'K', type: 'normal' },
  KC_L: { label: 'L', type: 'normal' },
  KC_M: { label: 'M', type: 'normal' },
  KC_N: { label: 'N', type: 'normal' },
  KC_O: { label: 'O', type: 'normal' },
  KC_P: { label: 'P', type: 'normal' },
  KC_Q: { label: 'Q', type: 'normal' },
  KC_R: { label: 'R', type: 'normal' },
  KC_S: { label: 'S', type: 'normal' },
  KC_T: { label: 'T', type: 'normal' },
  KC_U: { label: 'U', type: 'normal' },
  KC_V: { label: 'V', type: 'normal' },
  KC_W: { label: 'W', type: 'normal' },
  KC_X: { label: 'X', type: 'normal' },
  KC_Y: { label: 'Y', type: 'normal' },
  KC_Z: { label: 'Z', type: 'normal' },

  // Numbers
  KC_1: { label: '1', type: 'normal' },
  KC_2: { label: '2', type: 'normal' },
  KC_3: { label: '3', type: 'normal' },
  KC_4: { label: '4', type: 'normal' },
  KC_5: { label: '5', type: 'normal' },
  KC_6: { label: '6', type: 'normal' },
  KC_7: { label: '7', type: 'normal' },
  KC_8: { label: '8', type: 'normal' },
  KC_9: { label: '9', type: 'normal' },
  KC_0: { label: '0', type: 'normal' },

  // Special keys
  KC_ENT: { label: 'Enter', type: 'normal' },
  KC_ENTER: { label: 'Enter', type: 'normal' },
  KC_ESC: { label: 'Esc', type: 'normal' },
  KC_ESCAPE: { label: 'Esc', type: 'normal' },
  KC_BSPC: { label: 'Bksp', type: 'normal' },
  KC_BACKSPACE: { label: 'Bksp', type: 'normal' },
  KC_TAB: { label: 'Tab', type: 'normal' },
  KC_SPC: { label: 'Space', type: 'normal' },
  KC_SPACE: { label: 'Space', type: 'normal' },
  KC_CAPS: { label: 'Caps', type: 'normal' },
  KC_CAPS_LOCK: { label: 'Caps', type: 'normal' },
  KC_DEL: { label: 'Del', type: 'normal' },
  KC_DELETE: { label: 'Del', type: 'normal' },
  KC_INS: { label: 'Ins', type: 'normal' },
  KC_INSERT: { label: 'Ins', type: 'normal' },
  KC_PSCR: { label: 'PrtSc', type: 'normal' },
  KC_PRINT_SCREEN: { label: 'PrtSc', type: 'normal' },
  KC_SCRL: { label: 'ScrLk', type: 'normal' },
  KC_SCROLL_LOCK: { label: 'ScrLk', type: 'normal' },
  KC_PAUS: { label: 'Pause', type: 'normal' },
  KC_PAUSE: { label: 'Pause', type: 'normal' },
  KC_APP: { label: 'Menu', type: 'normal' },
  KC_APPLICATION: { label: 'Menu', type: 'normal' },

  // Symbols
  KC_MINS: { label: '-', type: 'normal' },
  KC_MINUS: { label: '-', type: 'normal' },
  KC_EQL: { label: '=', type: 'normal' },
  KC_EQUAL: { label: '=', type: 'normal' },
  KC_LBRC: { label: '[', type: 'normal' },
  KC_LEFT_BRACKET: { label: '[', type: 'normal' },
  KC_RBRC: { label: ']', type: 'normal' },
  KC_RIGHT_BRACKET: { label: ']', type: 'normal' },
  KC_BSLS: { label: '\\', type: 'normal' },
  KC_BACKSLASH: { label: '\\', type: 'normal' },
  KC_SCLN: { label: ';', type: 'normal' },
  KC_SEMICOLON: { label: ';', type: 'normal' },
  KC_QUOT: { label: "'", type: 'normal' },
  KC_QUOTE: { label: "'", type: 'normal' },
  KC_GRV: { label: '`', type: 'normal' },
  KC_GRAVE: { label: '`', type: 'normal' },
  KC_COMM: { label: ',', type: 'normal' },
  KC_COMMA: { label: ',', type: 'normal' },
  KC_DOT: { label: '.', type: 'normal' },
  KC_SLSH: { label: '/', type: 'normal' },
  KC_SLASH: { label: '/', type: 'normal' },
  KC_NUBS: { label: '\\', type: 'normal' },
  KC_NONUS_BACKSLASH: { label: '\\', type: 'normal' },
  KC_NUHS: { label: '#', type: 'normal' },
  KC_NONUS_HASH: { label: '#', type: 'normal' },

  // Shifted symbols (QMK convenience aliases)
  KC_TILD: { label: '~', type: 'normal' },
  KC_TILDE: { label: '~', type: 'normal' },
  KC_EXLM: { label: '!', type: 'normal' },
  KC_EXCLAIM: { label: '!', type: 'normal' },
  KC_AT: { label: '@', type: 'normal' },
  KC_HASH: { label: '#', type: 'normal' },
  KC_DLR: { label: '$', type: 'normal' },
  KC_DOLLAR: { label: '$', type: 'normal' },
  KC_PERC: { label: '%', type: 'normal' },
  KC_PERCENT: { label: '%', type: 'normal' },
  KC_CIRC: { label: '^', type: 'normal' },
  KC_CIRCUMFLEX: { label: '^', type: 'normal' },
  KC_AMPR: { label: '&', type: 'normal' },
  KC_AMPERSAND: { label: '&', type: 'normal' },
  KC_ASTR: { label: '*', type: 'normal' },
  KC_ASTERISK: { label: '*', type: 'normal' },
  KC_LPRN: { label: '(', type: 'normal' },
  KC_LEFT_PAREN: { label: '(', type: 'normal' },
  KC_RPRN: { label: ')', type: 'normal' },
  KC_RIGHT_PAREN: { label: ')', type: 'normal' },
  KC_UNDS: { label: '_', type: 'normal' },
  KC_UNDERSCORE: { label: '_', type: 'normal' },
  KC_PLUS: { label: '+', type: 'normal' },
  KC_LCBR: { label: '{', type: 'normal' },
  KC_LEFT_CURLY_BRACE: { label: '{', type: 'normal' },
  KC_RCBR: { label: '}', type: 'normal' },
  KC_RIGHT_CURLY_BRACE: { label: '}', type: 'normal' },
  KC_PIPE: { label: '|', type: 'normal' },
  KC_COLN: { label: ':', type: 'normal' },
  KC_COLON: { label: ':', type: 'normal' },
  KC_DQUO: { label: '"', type: 'normal' },
  KC_DOUBLE_QUOTE: { label: '"', type: 'normal' },
  KC_LABK: { label: '<', type: 'normal' },
  KC_LEFT_ANGLE_BRACKET: { label: '<', type: 'normal' },
  KC_RABK: { label: '>', type: 'normal' },
  KC_RIGHT_ANGLE_BRACKET: { label: '>', type: 'normal' },
  KC_QUES: { label: '?', type: 'normal' },
  KC_QUESTION: { label: '?', type: 'normal' },

  // Modifiers
  KC_LCTL: { label: 'Ctrl', type: 'modifier' },
  KC_LCTRL: { label: 'Ctrl', type: 'modifier' },
  KC_LEFT_CTRL: { label: 'Ctrl', type: 'modifier' },
  KC_LSFT: { label: 'Shift', type: 'modifier' },
  KC_LSHIFT: { label: 'Shift', type: 'modifier' },
  KC_LEFT_SHIFT: { label: 'Shift', type: 'modifier' },
  KC_LALT: { label: 'Alt', type: 'modifier' },
  KC_LEFT_ALT: { label: 'Alt', type: 'modifier' },
  KC_LOPT: { label: 'Opt', type: 'modifier' },
  KC_LGUI: { label: 'GUI', type: 'modifier' },
  KC_LEFT_GUI: { label: 'GUI', type: 'modifier' },
  KC_LCMD: { label: 'Cmd', type: 'modifier' },
  KC_LWIN: { label: 'Win', type: 'modifier' },
  KC_RCTL: { label: 'RCtrl', type: 'modifier' },
  KC_RCTRL: { label: 'RCtrl', type: 'modifier' },
  KC_RIGHT_CTRL: { label: 'RCtrl', type: 'modifier' },
  KC_RSFT: { label: 'RShift', type: 'modifier' },
  KC_RSHIFT: { label: 'RShift', type: 'modifier' },
  KC_RIGHT_SHIFT: { label: 'RShift', type: 'modifier' },
  KC_RALT: { label: 'RAlt', type: 'modifier' },
  KC_RIGHT_ALT: { label: 'RAlt', type: 'modifier' },
  KC_ROPT: { label: 'ROpt', type: 'modifier' },
  KC_ALGR: { label: 'AltGr', type: 'modifier' },
  KC_RGUI: { label: 'RGUI', type: 'modifier' },
  KC_RIGHT_GUI: { label: 'RGUI', type: 'modifier' },
  KC_RCMD: { label: 'RCmd', type: 'modifier' },
  KC_RWIN: { label: 'RWin', type: 'modifier' },

  // Navigation
  KC_LEFT: { label: 'Left', type: 'navigation' },
  KC_RIGHT: { label: 'Right', type: 'navigation' },
  KC_RGHT: { label: 'Right', type: 'navigation' },
  KC_UP: { label: 'Up', type: 'navigation' },
  KC_DOWN: { label: 'Down', type: 'navigation' },
  KC_HOME: { label: 'Home', type: 'navigation' },
  KC_END: { label: 'End', type: 'navigation' },
  KC_PGUP: { label: 'PgUp', type: 'navigation' },
  KC_PAGE_UP: { label: 'PgUp', type: 'navigation' },
  KC_PGDN: { label: 'PgDn', type: 'navigation' },
  KC_PAGE_DOWN: { label: 'PgDn', type: 'navigation' },

  // Function keys
  KC_F1: { label: 'F1', type: 'function' },
  KC_F2: { label: 'F2', type: 'function' },
  KC_F3: { label: 'F3', type: 'function' },
  KC_F4: { label: 'F4', type: 'function' },
  KC_F5: { label: 'F5', type: 'function' },
  KC_F6: { label: 'F6', type: 'function' },
  KC_F7: { label: 'F7', type: 'function' },
  KC_F8: { label: 'F8', type: 'function' },
  KC_F9: { label: 'F9', type: 'function' },
  KC_F10: { label: 'F10', type: 'function' },
  KC_F11: { label: 'F11', type: 'function' },
  KC_F12: { label: 'F12', type: 'function' },
  KC_F13: { label: 'F13', type: 'function' },
  KC_F14: { label: 'F14', type: 'function' },
  KC_F15: { label: 'F15', type: 'function' },
  KC_F16: { label: 'F16', type: 'function' },
  KC_F17: { label: 'F17', type: 'function' },
  KC_F18: { label: 'F18', type: 'function' },
  KC_F19: { label: 'F19', type: 'function' },
  KC_F20: { label: 'F20', type: 'function' },
  KC_F21: { label: 'F21', type: 'function' },
  KC_F22: { label: 'F22', type: 'function' },
  KC_F23: { label: 'F23', type: 'function' },
  KC_F24: { label: 'F24', type: 'function' },

  // Media
  KC_MUTE: { label: 'Mute', type: 'media' },
  KC_AUDIO_MUTE: { label: 'Mute', type: 'media' },
  KC_VOLU: { label: 'Vol+', type: 'media' },
  KC_AUDIO_VOL_UP: { label: 'Vol+', type: 'media' },
  KC_VOLD: { label: 'Vol-', type: 'media' },
  KC_AUDIO_VOL_DOWN: { label: 'Vol-', type: 'media' },
  KC_MPLY: { label: 'Play', type: 'media' },
  KC_MEDIA_PLAY_PAUSE: { label: 'Play', type: 'media' },
  KC_MNXT: { label: 'Next', type: 'media' },
  KC_MEDIA_NEXT_TRACK: { label: 'Next', type: 'media' },
  KC_MPRV: { label: 'Prev', type: 'media' },
  KC_MEDIA_PREV_TRACK: { label: 'Prev', type: 'media' },
  KC_MSTP: { label: 'Stop', type: 'media' },
  KC_MEDIA_STOP: { label: 'Stop', type: 'media' },
  KC_MSEL: { label: 'Sel', type: 'media' },
  KC_MEDIA_SELECT: { label: 'Sel', type: 'media' },
  KC_EJCT: { label: 'Eject', type: 'media' },
  KC_MEDIA_EJECT: { label: 'Eject', type: 'media' },
  KC_BRIU: { label: 'Bri+', type: 'media' },
  KC_BRIGHTNESS_UP: { label: 'Bri+', type: 'media' },
  KC_BRID: { label: 'Bri-', type: 'media' },
  KC_BRIGHTNESS_DOWN: { label: 'Bri-', type: 'media' },

  // Numpad
  KC_NUM: { label: 'Num', type: 'normal' },
  KC_NUM_LOCK: { label: 'Num', type: 'normal' },
  KC_P1: { label: 'KP1', type: 'normal' },
  KC_KP_1: { label: 'KP1', type: 'normal' },
  KC_P2: { label: 'KP2', type: 'normal' },
  KC_KP_2: { label: 'KP2', type: 'normal' },
  KC_P3: { label: 'KP3', type: 'normal' },
  KC_KP_3: { label: 'KP3', type: 'normal' },
  KC_P4: { label: 'KP4', type: 'normal' },
  KC_KP_4: { label: 'KP4', type: 'normal' },
  KC_P5: { label: 'KP5', type: 'normal' },
  KC_KP_5: { label: 'KP5', type: 'normal' },
  KC_P6: { label: 'KP6', type: 'normal' },
  KC_KP_6: { label: 'KP6', type: 'normal' },
  KC_P7: { label: 'KP7', type: 'normal' },
  KC_KP_7: { label: 'KP7', type: 'normal' },
  KC_P8: { label: 'KP8', type: 'normal' },
  KC_KP_8: { label: 'KP8', type: 'normal' },
  KC_P9: { label: 'KP9', type: 'normal' },
  KC_KP_9: { label: 'KP9', type: 'normal' },
  KC_P0: { label: 'KP0', type: 'normal' },
  KC_KP_0: { label: 'KP0', type: 'normal' },
  KC_PDOT: { label: 'KP.', type: 'normal' },
  KC_KP_DOT: { label: 'KP.', type: 'normal' },
  KC_PCMM: { label: 'KP,', type: 'normal' },
  KC_KP_COMMA: { label: 'KP,', type: 'normal' },
  KC_PENT: { label: 'KPEnt', type: 'normal' },
  KC_KP_ENTER: { label: 'KPEnt', type: 'normal' },
  KC_PPLS: { label: 'KP+', type: 'normal' },
  KC_KP_PLUS: { label: 'KP+', type: 'normal' },
  KC_PMNS: { label: 'KP-', type: 'normal' },
  KC_KP_MINUS: { label: 'KP-', type: 'normal' },
  KC_PAST: { label: 'KP*', type: 'normal' },
  KC_KP_ASTERISK: { label: 'KP*', type: 'normal' },
  KC_PSLS: { label: 'KP/', type: 'normal' },
  KC_KP_SLASH: { label: 'KP/', type: 'normal' },
  KC_PEQL: { label: 'KP=', type: 'normal' },
  KC_KP_EQUAL: { label: 'KP=', type: 'normal' },

  // Special
  KC_NO: { label: '', type: 'none' },
  KC_TRNS: { label: '▽', type: 'transparent' },
  KC_TRANSPARENT: { label: '▽', type: 'transparent' },
  _______: { label: '▽', type: 'transparent' },
  XXXXXXX: { label: '', type: 'none' },

  // QMK special
  QK_BOOT: { label: 'Boot', type: 'custom' },
  QK_BOOTLOADER: { label: 'Boot', type: 'custom' },
  QK_RBT: { label: 'Reset', type: 'custom' },
  QK_REBOOT: { label: 'Reset', type: 'custom' },
  DB_TOGG: { label: 'Debug', type: 'custom' },
  EE_CLR: { label: 'EEClr', type: 'custom' },
  QK_CLEAR_EEPROM: { label: 'EEClr', type: 'custom' },
  CW_TOGG: { label: 'CapsW', type: 'custom' },
  QK_CAPS_WORD_TOGGLE: { label: 'CapsW', type: 'custom' },
  KC_CAPS_WORD: { label: 'CapsW', type: 'custom' },
  QK_REP: { label: 'Repeat', type: 'custom' },
  QK_REPEAT_KEY: { label: 'Repeat', type: 'custom' },
  QK_AREP: { label: 'AltRep', type: 'custom' },
  QK_ALT_REPEAT_KEY: { label: 'AltRep', type: 'custom' },

  // RGB / Backlight
  RGB_TOG: { label: 'RGB', type: 'custom' },
  RGB_MOD: { label: 'RGB+', type: 'custom' },
  RGB_RMOD: { label: 'RGB-', type: 'custom' },
  RGB_HUI: { label: 'Hue+', type: 'custom' },
  RGB_HUD: { label: 'Hue-', type: 'custom' },
  RGB_SAI: { label: 'Sat+', type: 'custom' },
  RGB_SAD: { label: 'Sat-', type: 'custom' },
  RGB_VAI: { label: 'Val+', type: 'custom' },
  RGB_VAD: { label: 'Val-', type: 'custom' },
  RGB_SPI: { label: 'Spd+', type: 'custom' },
  RGB_SPD: { label: 'Spd-', type: 'custom' },
  BL_TOGG: { label: 'BL', type: 'custom' },
  BL_UP: { label: 'BL+', type: 'custom' },
  BL_DOWN: { label: 'BL-', type: 'custom' },
  BL_STEP: { label: 'BLStp', type: 'custom' },

  // Mouse keys
  KC_MS_U: { label: 'Ms Up', type: 'navigation' },
  KC_MS_UP: { label: 'Ms Up', type: 'navigation' },
  KC_MS_D: { label: 'Ms Dn', type: 'navigation' },
  KC_MS_DOWN: { label: 'Ms Dn', type: 'navigation' },
  KC_MS_L: { label: 'Ms L', type: 'navigation' },
  KC_MS_LEFT: { label: 'Ms L', type: 'navigation' },
  KC_MS_R: { label: 'Ms R', type: 'navigation' },
  KC_MS_RIGHT: { label: 'Ms R', type: 'navigation' },
  KC_BTN1: { label: 'Btn1', type: 'navigation' },
  KC_MS_BTN1: { label: 'Btn1', type: 'navigation' },
  KC_BTN2: { label: 'Btn2', type: 'navigation' },
  KC_MS_BTN2: { label: 'Btn2', type: 'navigation' },
  KC_BTN3: { label: 'Btn3', type: 'navigation' },
  KC_MS_BTN3: { label: 'Btn3', type: 'navigation' },
  KC_WH_U: { label: 'WhlUp', type: 'navigation' },
  KC_MS_WH_UP: { label: 'WhlUp', type: 'navigation' },
  KC_WH_D: { label: 'WhlDn', type: 'navigation' },
  KC_MS_WH_DOWN: { label: 'WhlDn', type: 'navigation' },
}

/**
 * ZMK keycode names → QMK equivalents.
 * ZMK uses shorter names without KC_ prefix.
 */
const ZMK_TO_QMK: Record<string, string> = {
  // Letters
  A: 'KC_A',
  B: 'KC_B',
  C: 'KC_C',
  D: 'KC_D',
  E: 'KC_E',
  F: 'KC_F',
  G: 'KC_G',
  H: 'KC_H',
  I: 'KC_I',
  J: 'KC_J',
  K: 'KC_K',
  L: 'KC_L',
  M: 'KC_M',
  N: 'KC_N',
  O: 'KC_O',
  P: 'KC_P',
  Q: 'KC_Q',
  R: 'KC_R',
  S: 'KC_S',
  T: 'KC_T',
  U: 'KC_U',
  V: 'KC_V',
  W: 'KC_W',
  X: 'KC_X',
  Y: 'KC_Y',
  Z: 'KC_Z',

  // Numbers
  N1: 'KC_1',
  N2: 'KC_2',
  N3: 'KC_3',
  N4: 'KC_4',
  N5: 'KC_5',
  N6: 'KC_6',
  N7: 'KC_7',
  N8: 'KC_8',
  N9: 'KC_9',
  N0: 'KC_0',
  NUMBER_1: 'KC_1',
  NUMBER_2: 'KC_2',
  NUMBER_3: 'KC_3',
  NUMBER_4: 'KC_4',
  NUMBER_5: 'KC_5',
  NUMBER_6: 'KC_6',
  NUMBER_7: 'KC_7',
  NUMBER_8: 'KC_8',
  NUMBER_9: 'KC_9',
  NUMBER_0: 'KC_0',

  // Special keys
  RET: 'KC_ENT',
  RETURN: 'KC_ENT',
  ENTER: 'KC_ENT',
  ESC: 'KC_ESC',
  ESCAPE: 'KC_ESC',
  BSPC: 'KC_BSPC',
  BACKSPACE: 'KC_BSPC',
  TAB: 'KC_TAB',
  SPACE: 'KC_SPC',
  SPC: 'KC_SPC',
  CAPS: 'KC_CAPS',
  CAPSLOCK: 'KC_CAPS',
  DEL: 'KC_DEL',
  DELETE: 'KC_DEL',
  INS: 'KC_INS',
  INSERT: 'KC_INS',
  PSCRN: 'KC_PSCR',
  PRINTSCREEN: 'KC_PSCR',
  SLCK: 'KC_SCRL',
  SCROLLLOCK: 'KC_SCRL',
  PAUSE_BREAK: 'KC_PAUS',
  K_APP: 'KC_APP',
  K_APPLICATION: 'KC_APP',

  // Symbols
  MINUS: 'KC_MINS',
  EQUAL: 'KC_EQL',
  LBKT: 'KC_LBRC',
  LEFT_BRACKET: 'KC_LBRC',
  RBKT: 'KC_RBRC',
  RIGHT_BRACKET: 'KC_RBRC',
  BSLH: 'KC_BSLS',
  BACKSLASH: 'KC_BSLS',
  SEMI: 'KC_SCLN',
  SEMICOLON: 'KC_SCLN',
  SQT: 'KC_QUOT',
  SINGLE_QUOTE: 'KC_QUOT',
  APOSTROPHE: 'KC_QUOT',
  APOS: 'KC_QUOT',
  GRAVE: 'KC_GRV',
  COMMA: 'KC_COMM',
  DOT: 'KC_DOT',
  PERIOD: 'KC_DOT',
  FSLH: 'KC_SLSH',
  SLASH: 'KC_SLSH',
  FORWARD_SLASH: 'KC_SLSH',
  NON_US_BACKSLASH: 'KC_NUBS',
  NON_US_HASH: 'KC_NUHS',

  // Shifted symbols
  TILDE: 'KC_TILD',
  EXCL: 'KC_EXLM',
  EXCLAMATION: 'KC_EXLM',
  AT_SIGN: 'KC_AT',
  AT: 'KC_AT',
  HASH: 'KC_HASH',
  POUND: 'KC_HASH',
  DLLR: 'KC_DLR',
  DOLLAR: 'KC_DLR',
  PRCNT: 'KC_PERC',
  PERCENT: 'KC_PERC',
  CARET: 'KC_CIRC',
  AMPS: 'KC_AMPR',
  AMPERSAND: 'KC_AMPR',
  ASTRK: 'KC_ASTR',
  ASTERISK: 'KC_ASTR',
  STAR: 'KC_ASTR',
  LPAR: 'KC_LPRN',
  LEFT_PARENTHESIS: 'KC_LPRN',
  RPAR: 'KC_RPRN',
  RIGHT_PARENTHESIS: 'KC_RPRN',
  UNDER: 'KC_UNDS',
  UNDERSCORE: 'KC_UNDS',
  PLUS: 'KC_PLUS',
  LBRC: 'KC_LCBR',
  LEFT_BRACE: 'KC_LCBR',
  RBRC: 'KC_RCBR',
  RIGHT_BRACE: 'KC_RCBR',
  PIPE: 'KC_PIPE',
  COLON: 'KC_COLN',
  DQT: 'KC_DQUO',
  DOUBLE_QUOTES: 'KC_DQUO',
  LT: 'KC_LABK',
  LESS_THAN: 'KC_LABK',
  GT: 'KC_RABK',
  GREATER_THAN: 'KC_RABK',
  QMARK: 'KC_QUES',
  QUESTION: 'KC_QUES',

  // Modifiers
  LSHFT: 'KC_LSFT',
  LEFT_SHIFT: 'KC_LSFT',
  LSHIFT: 'KC_LSFT',
  LCTRL: 'KC_LCTL',
  LEFT_CONTROL: 'KC_LCTL',
  LALT: 'KC_LALT',
  LEFT_ALT: 'KC_LALT',
  LGUI: 'KC_LGUI',
  LEFT_GUI: 'KC_LGUI',
  LCMD: 'KC_LGUI',
  LEFT_COMMAND: 'KC_LGUI',
  LMETA: 'KC_LGUI',
  LEFT_META: 'KC_LGUI',
  LWIN: 'KC_LGUI',
  LEFT_WIN: 'KC_LGUI',
  RSHFT: 'KC_RSFT',
  RIGHT_SHIFT: 'KC_RSFT',
  RSHIFT: 'KC_RSFT',
  RCTRL: 'KC_RCTL',
  RIGHT_CONTROL: 'KC_RCTL',
  RALT: 'KC_RALT',
  RIGHT_ALT: 'KC_RALT',
  RGUI: 'KC_RGUI',
  RIGHT_GUI: 'KC_RGUI',
  RCMD: 'KC_RGUI',
  RIGHT_COMMAND: 'KC_RGUI',
  RMETA: 'KC_RGUI',
  RIGHT_META: 'KC_RGUI',
  RWIN: 'KC_RGUI',
  RIGHT_WIN: 'KC_RGUI',

  // Navigation
  LEFT: 'KC_LEFT',
  RIGHT: 'KC_RIGHT',
  UP: 'KC_UP',
  DOWN: 'KC_DOWN',
  HOME: 'KC_HOME',
  END: 'KC_END',
  PG_UP: 'KC_PGUP',
  PAGE_UP: 'KC_PGUP',
  PG_DN: 'KC_PGDN',
  PAGE_DOWN: 'KC_PGDN',

  // Function keys
  F1: 'KC_F1',
  F2: 'KC_F2',
  F3: 'KC_F3',
  F4: 'KC_F4',
  F5: 'KC_F5',
  F6: 'KC_F6',
  F7: 'KC_F7',
  F8: 'KC_F8',
  F9: 'KC_F9',
  F10: 'KC_F10',
  F11: 'KC_F11',
  F12: 'KC_F12',
  F13: 'KC_F13',
  F14: 'KC_F14',
  F15: 'KC_F15',
  F16: 'KC_F16',
  F17: 'KC_F17',
  F18: 'KC_F18',
  F19: 'KC_F19',
  F20: 'KC_F20',
  F21: 'KC_F21',
  F22: 'KC_F22',
  F23: 'KC_F23',
  F24: 'KC_F24',

  // Media
  C_MUTE: 'KC_MUTE',
  C_VOL_UP: 'KC_VOLU',
  C_VOLUME_UP: 'KC_VOLU',
  C_VOL_DN: 'KC_VOLD',
  C_VOLUME_DOWN: 'KC_VOLD',
  C_PP: 'KC_MPLY',
  C_PLAY_PAUSE: 'KC_MPLY',
  C_NEXT: 'KC_MNXT',
  C_PREV: 'KC_MPRV',
  C_PREVIOUS: 'KC_MPRV',
  C_STOP: 'KC_MSTP',
  C_BRI_UP: 'KC_BRIU',
  C_BRIGHTNESS_INC: 'KC_BRIU',
  C_BRI_DN: 'KC_BRID',
  C_BRIGHTNESS_DEC: 'KC_BRID',
  C_BRI_INC: 'KC_BRIU',
  C_BRI_DEC: 'KC_BRID',

  // Numpad
  KP_N1: 'KC_P1',
  KP_NUMBER_1: 'KC_P1',
  KP_N2: 'KC_P2',
  KP_NUMBER_2: 'KC_P2',
  KP_N3: 'KC_P3',
  KP_NUMBER_3: 'KC_P3',
  KP_N4: 'KC_P4',
  KP_NUMBER_4: 'KC_P4',
  KP_N5: 'KC_P5',
  KP_NUMBER_5: 'KC_P5',
  KP_N6: 'KC_P6',
  KP_NUMBER_6: 'KC_P6',
  KP_N7: 'KC_P7',
  KP_NUMBER_7: 'KC_P7',
  KP_N8: 'KC_P8',
  KP_NUMBER_8: 'KC_P8',
  KP_N9: 'KC_P9',
  KP_NUMBER_9: 'KC_P9',
  KP_N0: 'KC_P0',
  KP_NUMBER_0: 'KC_P0',
  KP_DOT: 'KC_PDOT',
  KP_ENTER: 'KC_PENT',
  KP_PLUS: 'KC_PPLS',
  KP_MINUS: 'KC_PMNS',
  KP_MULTIPLY: 'KC_PAST',
  KP_ASTERISK: 'KC_PAST',
  KP_SLASH: 'KC_PSLS',
  KP_DIVIDE: 'KC_PSLS',
  KP_EQUAL: 'KC_PEQL',
  KP_NUM: 'KC_NUM',
  KP_NUMLOCK: 'KC_NUM',
}

/**
 * Modifier name lookup used for mod-tap and modifier key parsing.
 * Maps short/long modifier names to a display label and KeyType.
 */
const MODIFIER_NAMES: Record<string, KeycodeEntry> = {
  // QMK modifier names used in MT()/LSFT_T() etc.
  MOD_LSFT: { label: 'Shift', type: 'modifier' },
  MOD_LCTL: { label: 'Ctrl', type: 'modifier' },
  MOD_LALT: { label: 'Alt', type: 'modifier' },
  MOD_LGUI: { label: 'GUI', type: 'modifier' },
  MOD_RSFT: { label: 'RShift', type: 'modifier' },
  MOD_RCTL: { label: 'RCtrl', type: 'modifier' },
  MOD_RALT: { label: 'RAlt', type: 'modifier' },
  MOD_RGUI: { label: 'RGUI', type: 'modifier' },
  MOD_HYPR: { label: 'Hyper', type: 'modifier' },
  MOD_MEH: { label: 'Meh', type: 'modifier' },
  // ZMK modifier names
  LSHFT: { label: 'Shift', type: 'modifier' },
  LSHIFT: { label: 'Shift', type: 'modifier' },
  LEFT_SHIFT: { label: 'Shift', type: 'modifier' },
  LCTRL: { label: 'Ctrl', type: 'modifier' },
  LEFT_CONTROL: { label: 'Ctrl', type: 'modifier' },
  LALT: { label: 'Alt', type: 'modifier' },
  LEFT_ALT: { label: 'Alt', type: 'modifier' },
  LGUI: { label: 'GUI', type: 'modifier' },
  LEFT_GUI: { label: 'GUI', type: 'modifier' },
  LCMD: { label: 'Cmd', type: 'modifier' },
  LEFT_COMMAND: { label: 'Cmd', type: 'modifier' },
  LMETA: { label: 'Meta', type: 'modifier' },
  LEFT_META: { label: 'Meta', type: 'modifier' },
  RSHFT: { label: 'RShift', type: 'modifier' },
  RSHIFT: { label: 'RShift', type: 'modifier' },
  RIGHT_SHIFT: { label: 'RShift', type: 'modifier' },
  RCTRL: { label: 'RCtrl', type: 'modifier' },
  RIGHT_CONTROL: { label: 'RCtrl', type: 'modifier' },
  RALT: { label: 'RAlt', type: 'modifier' },
  RIGHT_ALT: { label: 'RAlt', type: 'modifier' },
  RGUI: { label: 'RGUI', type: 'modifier' },
  RIGHT_GUI: { label: 'RGUI', type: 'modifier' },
  RCMD: { label: 'RCmd', type: 'modifier' },
  RIGHT_COMMAND: { label: 'RCmd', type: 'modifier' },
  RMETA: { label: 'RMeta', type: 'modifier' },
  RIGHT_META: { label: 'RMeta', type: 'modifier' },
}

/**
 * VIA / QMK 16-bit keycode ranges for decoding integer keycodes
 * from VIA backup files.
 */
// Basic keycodes: 0x0000-0x00FF
const VIA_BASIC_KEYCODES: Record<number, string> = {
  0x00: 'KC_NO',
  0x01: 'KC_TRNS',
  0x04: 'KC_A',
  0x05: 'KC_B',
  0x06: 'KC_C',
  0x07: 'KC_D',
  0x08: 'KC_E',
  0x09: 'KC_F',
  0x0a: 'KC_G',
  0x0b: 'KC_H',
  0x0c: 'KC_I',
  0x0d: 'KC_J',
  0x0e: 'KC_K',
  0x0f: 'KC_L',
  0x10: 'KC_M',
  0x11: 'KC_N',
  0x12: 'KC_O',
  0x13: 'KC_P',
  0x14: 'KC_Q',
  0x15: 'KC_R',
  0x16: 'KC_S',
  0x17: 'KC_T',
  0x18: 'KC_U',
  0x19: 'KC_V',
  0x1a: 'KC_W',
  0x1b: 'KC_X',
  0x1c: 'KC_Y',
  0x1d: 'KC_Z',
  0x1e: 'KC_1',
  0x1f: 'KC_2',
  0x20: 'KC_3',
  0x21: 'KC_4',
  0x22: 'KC_5',
  0x23: 'KC_6',
  0x24: 'KC_7',
  0x25: 'KC_8',
  0x26: 'KC_9',
  0x27: 'KC_0',
  0x28: 'KC_ENT',
  0x29: 'KC_ESC',
  0x2a: 'KC_BSPC',
  0x2b: 'KC_TAB',
  0x2c: 'KC_SPC',
  0x2d: 'KC_MINS',
  0x2e: 'KC_EQL',
  0x2f: 'KC_LBRC',
  0x30: 'KC_RBRC',
  0x31: 'KC_BSLS',
  0x32: 'KC_NUHS',
  0x33: 'KC_SCLN',
  0x34: 'KC_QUOT',
  0x35: 'KC_GRV',
  0x36: 'KC_COMM',
  0x37: 'KC_DOT',
  0x38: 'KC_SLSH',
  0x39: 'KC_CAPS',
  0x3a: 'KC_F1',
  0x3b: 'KC_F2',
  0x3c: 'KC_F3',
  0x3d: 'KC_F4',
  0x3e: 'KC_F5',
  0x3f: 'KC_F6',
  0x40: 'KC_F7',
  0x41: 'KC_F8',
  0x42: 'KC_F9',
  0x43: 'KC_F10',
  0x44: 'KC_F11',
  0x45: 'KC_F12',
  0x46: 'KC_PSCR',
  0x47: 'KC_SCRL',
  0x48: 'KC_PAUS',
  0x49: 'KC_INS',
  0x4a: 'KC_HOME',
  0x4b: 'KC_PGUP',
  0x4c: 'KC_DEL',
  0x4d: 'KC_END',
  0x4e: 'KC_PGDN',
  0x4f: 'KC_RGHT',
  0x50: 'KC_LEFT',
  0x51: 'KC_DOWN',
  0x52: 'KC_UP',
  0x53: 'KC_NUM',
  0x54: 'KC_PSLS',
  0x55: 'KC_PAST',
  0x56: 'KC_PMNS',
  0x57: 'KC_PPLS',
  0x58: 'KC_PENT',
  0x59: 'KC_P1',
  0x5a: 'KC_P2',
  0x5b: 'KC_P3',
  0x5c: 'KC_P4',
  0x5d: 'KC_P5',
  0x5e: 'KC_P6',
  0x5f: 'KC_P7',
  0x60: 'KC_P8',
  0x61: 'KC_P9',
  0x62: 'KC_P0',
  0x63: 'KC_PDOT',
  0x64: 'KC_NUBS',
  0x65: 'KC_APP',
  0xe0: 'KC_LCTL',
  0xe1: 'KC_LSFT',
  0xe2: 'KC_LALT',
  0xe3: 'KC_LGUI',
  0xe4: 'KC_RCTL',
  0xe5: 'KC_RSFT',
  0xe6: 'KC_RALT',
  0xe7: 'KC_RGUI',
}

// Media keycodes for VIA (0x00A5+)
const VIA_MEDIA_KEYCODES: Record<number, string> = {
  0xa5: 'KC_MPLY',
  0xa6: 'KC_MSTP',
  0xa7: 'KC_MPRV',
  0xa8: 'KC_MNXT',
  0xa9: 'KC_EJCT',
  0xb5: 'KC_VOLU',
  0xb6: 'KC_VOLD',
  0xb7: 'KC_MUTE',
}

/**
 * Resolve a QMK keycode string to a KeycodeEntry.
 */
export function resolveQmkKeycode(keycode: string): KeycodeEntry | null {
  return QMK_KEYCODES[keycode] ?? null
}

/**
 * Resolve a ZMK keycode name to a KeycodeEntry.
 * First tries the ZMK→QMK mapping, then falls back to direct QMK lookup.
 */
export function resolveZmkKeycode(keycode: string): KeycodeEntry | null {
  const qmkName = ZMK_TO_QMK[keycode]
  if (qmkName) return QMK_KEYCODES[qmkName] ?? null
  // Try direct QMK lookup (some names are shared)
  return QMK_KEYCODES[keycode] ?? QMK_KEYCODES[`KC_${keycode}`] ?? null
}

/**
 * Resolve a modifier name to label (used for mod-tap / mod descriptions).
 */
export function resolveModifierName(name: string): KeycodeEntry | null {
  return MODIFIER_NAMES[name] ?? null
}

/**
 * Decode a VIA 16-bit integer keycode into a QMK keycode string.
 * Returns null if the keycode is not recognized.
 *
 * Bit layout:
 * - 0x0000-0x00FF: Basic keycodes
 * - 0x0100-0x1FFF: Modifier+keycode combos
 * - 0x4000-0x4FFF: Layer-tap LT(layer, kc)
 * - 0x5100-0x51FF: Momentary layer MO(layer)
 * - 0x5300-0x53FF: Toggle layer TG(layer)
 * - 0x5400-0x54FF: To layer TO(layer)
 * - 0x5800-0x58FF: One-shot layer OSL(layer)
 * - 0x5C00-0x5CFF: One-shot mod OSM(mod)
 * - 0x7000-0x7FFF: Mod-tap MT(mod, kc)
 */
export function decodeViaKeycode(value: number): string | null {
  // Basic keycodes
  if (value <= 0x00ff) {
    return VIA_BASIC_KEYCODES[value] ?? VIA_MEDIA_KEYCODES[value] ?? null
  }

  // Mod+keycode (0x0100-0x1FFF)
  if (value >= 0x0100 && value <= 0x1fff) {
    const mods = (value >> 8) & 0x1f
    const kc = value & 0xff
    const baseKey = VIA_BASIC_KEYCODES[kc]
    if (!baseKey) return null
    const modNames: string[] = []
    if (mods & 0x01) modNames.push('C')
    if (mods & 0x02) modNames.push('S')
    if (mods & 0x04) modNames.push('A')
    if (mods & 0x08) modNames.push('G')
    if (mods & 0x10) modNames.push('R')
    return `${modNames.join('')}(${baseKey})`
  }

  // Layer-tap (0x4000-0x4FFF)
  if (value >= 0x4000 && value <= 0x4fff) {
    const layer = (value >> 8) & 0x0f
    const kc = value & 0xff
    const baseKey = VIA_BASIC_KEYCODES[kc]
    if (!baseKey) return `LT(${layer},KC_NO)`
    return `LT(${layer},${baseKey})`
  }

  // MO - Momentary layer (0x5100-0x51FF)
  if (value >= 0x5100 && value <= 0x51ff) {
    const layer = value & 0x1f
    return `MO(${layer})`
  }

  // TG - Toggle layer (0x5300-0x53FF)
  if (value >= 0x5300 && value <= 0x53ff) {
    const layer = value & 0x1f
    return `TG(${layer})`
  }

  // TO - Go to layer (0x5400-0x54FF)
  if (value >= 0x5400 && value <= 0x54ff) {
    const layer = value & 0x1f
    return `TO(${layer})`
  }

  // OSL - One-shot layer (0x5800-0x58FF)
  if (value >= 0x5800 && value <= 0x58ff) {
    const layer = value & 0x1f
    return `OSL(${layer})`
  }

  // OSM - One-shot mod (0x5C00-0x5CFF)
  if (value >= 0x5c00 && value <= 0x5cff) {
    return `OSM(${value & 0xff})`
  }

  // Mod-tap (0x7000-0x7FFF)
  if (value >= 0x7000 && value <= 0x7fff) {
    const modBits = (value >> 8) & 0x1f
    const kc = value & 0xff
    const baseKey = VIA_BASIC_KEYCODES[kc]
    if (!baseKey) return null

    // Decode modifier bits to name
    const rightSide = (modBits & 0x10) !== 0
    const prefix = rightSide ? 'R' : 'L'
    const coreBits = modBits & 0x0f
    if (coreBits === 0x01) return `${prefix}CTL_T(${baseKey})`
    if (coreBits === 0x02) return `${prefix}SFT_T(${baseKey})`
    if (coreBits === 0x04) return `${prefix}ALT_T(${baseKey})`
    if (coreBits === 0x08) return `${prefix}GUI_T(${baseKey})`
    // Multi-mod
    return `MT(${modBits},${baseKey})`
  }

  // QK_BOOT (0x7C00)
  if (value === 0x7c00) return 'QK_BOOT'
  // QK_RBT (0x7C01)
  if (value === 0x7c01) return 'QK_RBT'

  return null
}

/**
 * Map a QMK modifier convenience alias (e.g. LSFT_T, RCTL_T) to its modifier label.
 */
const MOD_TAP_PREFIXES: Record<string, string> = {
  LSFT_T: 'Shift',
  LCTL_T: 'Ctrl',
  LALT_T: 'Alt',
  LGUI_T: 'GUI',
  LCMD_T: 'Cmd',
  LWIN_T: 'Win',
  RSFT_T: 'RShift',
  RCTL_T: 'RCtrl',
  RALT_T: 'RAlt',
  RGUI_T: 'RGUI',
  RCMD_T: 'RCmd',
  RWIN_T: 'RWin',
  LSG_T: 'Shift+GUI',
  SGUI_T: 'Shift+GUI',
  LCA_T: 'Ctrl+Alt',
  LAG_T: 'Alt+GUI',
  LCAG_T: 'Ctrl+Alt+GUI',
  HYPR_T: 'Hyper',
  MEH_T: 'Meh',
  ALL_T: 'Hyper',
}

export { QMK_KEYCODES, ZMK_TO_QMK, MODIFIER_NAMES, MOD_TAP_PREFIXES, VIA_BASIC_KEYCODES }
