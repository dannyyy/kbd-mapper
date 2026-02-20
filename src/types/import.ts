import type { PhysicalLayout } from './layout'
import type { Keymap } from './keymap'

export type ImportFormat =
  | 'kbd-mapper'
  | 'qmk-keymap'
  | 'qmk-info'
  | 'via-definition'
  | 'via-backup'
  | 'zmk-keymap'
  | 'kle'
  | 'unknown'

export interface ImportWarning {
  type:
    | 'unknown-keycode'
    | 'dropped-combo'
    | 'dropped-tapdance'
    | 'dropped-macro'
    | 'dropped-encoder'
    | 'key-count-mismatch'
    | 'unsupported-feature'
    | 'parse-warning'
  message: string
  details?: string
}

export interface ImportResult {
  layout?: PhysicalLayout
  keymap?: Keymap
  warnings: ImportWarning[]
  metadata: {
    sourceFormat: ImportFormat
    keyboardName?: string
    totalKeycodes?: number
    unmappedKeycodes?: number
  }
}
