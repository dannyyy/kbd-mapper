import type { ImportFormat, ImportResult } from '../../types/import'
import { detectFormat } from './detect'
import { parseQmkKeymap } from './qmk-keymap'
import { parseQmkInfo } from './qmk-info'
import { parseKle } from './kle'
import { parseViaDefinition } from './via-definition'
import { parseViaBackup } from './via-backup'
import { parseVial } from './vial'
import { parseZmkKeymap } from './zmk-keymap'

export { detectFormat } from './detect'
export type { ImportFormat, ImportResult }

/**
 * Format display names for the UI.
 */
export const FORMAT_LABELS: Record<ImportFormat, string> = {
  'kbd-mapper': 'kbd-mapper Project',
  'qmk-keymap': 'QMK Keymap',
  'qmk-info': 'QMK Keyboard Info',
  'via-definition': 'VIA/VIAL Definition',
  'via-backup': 'VIA Keymap Backup',
  vial: 'VIAL Saved Layout',
  'zmk-keymap': 'ZMK Keymap',
  kle: 'KLE Layout',
  unknown: 'Unknown',
}

/**
 * Describes what each format provides (layout, keymap, or both).
 */
export const FORMAT_PROVIDES: Record<
  Exclude<ImportFormat, 'unknown'>,
  { layout: boolean; keymap: boolean }
> = {
  'kbd-mapper': { layout: true, keymap: true },
  'qmk-keymap': { layout: false, keymap: true },
  'qmk-info': { layout: true, keymap: false },
  'via-definition': { layout: true, keymap: false },
  'via-backup': { layout: false, keymap: true },
  vial: { layout: false, keymap: true },
  'zmk-keymap': { layout: false, keymap: true },
  kle: { layout: true, keymap: false },
}

/**
 * Import a file by auto-detecting or specifying its format.
 */
export function importFile(content: string, filename: string, format?: ImportFormat): ImportResult {
  const detectedFormat = format ?? detectFormat(content, filename)

  switch (detectedFormat) {
    case 'qmk-keymap':
      return parseQmkKeymap(content)
    case 'qmk-info':
      return parseQmkInfo(content)
    case 'kle':
      return parseKle(content)
    case 'via-definition':
      return parseViaDefinition(content)
    case 'via-backup':
      return parseViaBackup(content)
    case 'vial':
      return parseVial(content)
    case 'zmk-keymap':
      return parseZmkKeymap(content)
    case 'kbd-mapper':
      // Native format — return as-is, handled by the caller
      return {
        warnings: [],
        metadata: { sourceFormat: 'kbd-mapper' },
      }
    default:
      throw new Error(
        'Unrecognized file format. Supported formats: QMK keymap.json, QMK info.json, VIA/VIAL definition, VIA backup, VIAL .vil, ZMK .keymap, KLE JSON.',
      )
  }
}
