import type { KeyBinding, Layer, Keymap } from '../types/keymap'
import type { Project } from '../types/project'
import { generateId } from './id'

export function createEmptyBinding(): KeyBinding {
  return { label: '', type: 'none' }
}

export function createTransparentBinding(): KeyBinding {
  return { label: '▽', type: 'transparent' }
}

export function createLayer(name: string, color: string, keyCount: number): Layer {
  return {
    id: generateId('layer'),
    name,
    color,
    bindings: Array.from({ length: keyCount }, () => createEmptyBinding()),
    visible: true,
  }
}

const LAYER_COLORS = [
  '#6366f1', // indigo
  '#f59e0b', // amber
  '#10b981', // emerald
  '#ef4444', // red
  '#8b5cf6', // violet
  '#06b6d4', // cyan
  '#f97316', // orange
  '#ec4899', // pink
]

export function getLayerColor(index: number): string {
  return LAYER_COLORS[index % LAYER_COLORS.length]!
}

export function createDefaultKeymap(keyCount: number): Keymap {
  return {
    id: generateId('keymap'),
    name: 'Default Keymap',
    layers: [createLayer('Base', getLayerColor(0), keyCount)],
  }
}

export function createDefaultProject(layout: import('../types/layout').PhysicalLayout): Project {
  return {
    id: generateId('project'),
    name: 'My Keyboard',
    layout,
    keymap: createDefaultKeymap(layout.keys.length),
    themeId: 'clean-light',
    settings: {
      renderMode: 'auto',
      showLayerColors: true,
    },
  }
}
