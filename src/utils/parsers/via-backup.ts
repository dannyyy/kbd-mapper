import type { KeyBinding } from '../../types/keymap'
import type { ImportResult, ImportWarning } from '../../types/import'
import { generateId } from '../id'
import { getLayerColor } from '../defaults'
import { decodeViaKeycode } from '../keycodes'
import { parseQmkKeycodeString } from './qmk-keymap'

/**
 * Parse a VIA keymap backup JSON file.
 *
 * VIA backups store keycodes as raw 16-bit integers.
 * Expected structure:
 * {
 *   "name": "My Keyboard",
 *   "vendorProductId": 1234567890,
 *   "layers": [
 *     [41, 30, 31, 32, ...],   // integers
 *     [0, 0, 0, ...]
 *   ]
 * }
 */
export function parseViaBackup(content: string): ImportResult {
  const data = JSON.parse(content)
  const warnings: ImportWarning[] = []

  if (!data.layers || !Array.isArray(data.layers)) {
    throw new Error('Invalid VIA backup: missing "layers" array')
  }

  let unmappedCount = 0
  let totalCount = 0

  const layers = (data.layers as number[][]).map((layerValues, layerIndex) => {
    const bindings: KeyBinding[] = layerValues.map((value, keyIndex) => {
      totalCount++

      // Decode the 16-bit integer to a QMK keycode string
      const keycodeStr = decodeViaKeycode(value)

      if (keycodeStr === null) {
        unmappedCount++
        warnings.push({
          type: 'unknown-keycode',
          message: `Unknown VIA keycode 0x${value.toString(16).padStart(4, '0')}`,
          details: `Layer ${layerIndex}, key ${keyIndex}`,
        })
        return { label: `0x${value.toString(16).toUpperCase()}`, type: 'custom' as const }
      }

      // Now parse the decoded QMK keycode string
      const { binding, warning } = parseQmkKeycodeString(keycodeStr)
      if (warning) {
        unmappedCount++
        warnings.push({
          type: 'unknown-keycode',
          message: warning,
          details: `Layer ${layerIndex}, key ${keyIndex}, decoded as ${keycodeStr}`,
        })
      }
      return binding
    })

    return {
      id: generateId('layer'),
      name: layerIndex === 0 ? 'Base' : `Layer ${layerIndex}`,
      color: getLayerColor(layerIndex),
      bindings,
      visible: true,
    }
  })

  return {
    keymap: {
      id: generateId('keymap'),
      name: data.name ?? 'VIA Import',
      layers,
    },
    warnings,
    metadata: {
      sourceFormat: 'via-backup',
      keyboardName: data.name,
      totalKeycodes: totalCount,
      unmappedKeycodes: unmappedCount,
    },
  }
}
