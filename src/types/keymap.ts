export type KeyType =
  | 'normal'
  | 'modifier'
  | 'layer-toggle'
  | 'layer-tap'
  | 'mod-tap'
  | 'transparent'
  | 'none'
  | 'media'
  | 'navigation'
  | 'function'
  | 'custom'

export interface KeyBinding {
  label: string
  type: KeyType
  holdLabel?: string
  holdType?: KeyType
}

export interface Layer {
  id: string
  name: string
  color: string
  bindings: KeyBinding[]
  visible: boolean
}

export interface Keymap {
  id: string
  name: string
  layers: Layer[]
}
