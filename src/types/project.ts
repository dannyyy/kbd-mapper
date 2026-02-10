import type { PhysicalLayout } from './layout'
import type { Keymap } from './keymap'
import type { Theme } from './theme'

export interface Project {
  id: string
  name: string
  layout: PhysicalLayout
  keymap: Keymap
  themeId: string
  settings: {
    renderMode: 'compact' | 'expanded' | 'auto'
    showLayerColors: boolean
  }
}

export type { PhysicalLayout, Keymap, Theme }
