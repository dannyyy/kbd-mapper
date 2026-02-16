import type { KeyBinding } from '../../types/keymap'

export function key(label: string): KeyBinding {
  return { label, type: 'normal' }
}

export function mod(label: string): KeyBinding {
  return { label, type: 'modifier' }
}

export function nav(label: string): KeyBinding {
  return { label, type: 'navigation' }
}

export function fn(label: string): KeyBinding {
  return { label, type: 'function' }
}

export function media(label: string): KeyBinding {
  return { label, type: 'media' }
}

export function lt(label: string, holdLabel: string): KeyBinding {
  return { label, type: 'layer-tap', holdLabel, holdType: 'layer-toggle' }
}

export function mt(label: string, holdLabel: string): KeyBinding {
  return { label, type: 'mod-tap', holdLabel, holdType: 'modifier' }
}

export function none(): KeyBinding {
  return { label: '', type: 'none' }
}

export function trans(): KeyBinding {
  return { label: '▽', type: 'transparent' }
}
