import type { KeyBinding } from '../../types/keymap'
import type { ImportResult, ImportWarning } from '../../types/import'
import { generateId } from '../id'
import { getLayerColor } from '../defaults'
import { decodeViaKeycode } from '../keycodes'
import { parseQmkKeycodeString } from './qmk-keymap'

/**
 * Parse a VIAL saved layout (.vil) file.
 *
 * VIAL .vil files are JSON with keycodes stored as integers in a 3D array:
 * {
 *   "version": 1,
 *   "uid": ...,
 *   "layout": [           // layer[]
 *     [                    //   row[]
 *       [41, 30, 31, ...], //     keycodes (integers)
 *       [...]
 *     ],
 *     [...]
 *   ],
 *   "encoder_layout": [...],
 *   "tap_dance": [...],
 *   "combo": [...],
 *   ...
 * }
 */
export function parseVial(content: string): ImportResult {
  const data = JSON.parse(content)
  const warnings: ImportWarning[] = []

  if (!data.layout || !Array.isArray(data.layout)) {
    throw new Error('Invalid VIAL file: missing "layout" array')
  }

  // VIAL layout is [layer][row][col] — flatten rows into a flat keycode array per layer
  const layerArrays: number[][] = (data.layout as number[][][]).map((layer) =>
    layer.flat().filter((v): v is number => typeof v === 'number' && v !== -1),
  )

  if (layerArrays.length === 0) {
    throw new Error('Invalid VIAL file: no layers found')
  }

  let unmappedCount = 0
  let totalCount = 0

  const layers = layerArrays.map((keycodes, layerIndex) => {
    const bindings: KeyBinding[] = keycodes.map((value, keyIndex) => {
      totalCount++

      const keycodeStr = decodeViaKeycode(value)

      if (keycodeStr === null) {
        unmappedCount++
        warnings.push({
          type: 'unknown-keycode',
          message: `Unknown keycode 0x${value.toString(16).padStart(4, '0')}`,
          details: `Layer ${layerIndex}, key ${keyIndex}`,
        })
        return { label: `0x${value.toString(16).toUpperCase()}`, type: 'custom' as const }
      }

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

  // Warn about unsupported features
  if (data.tap_dance && Array.isArray(data.tap_dance) && data.tap_dance.length > 0) {
    warnings.push({
      type: 'dropped-tapdance',
      message: `${data.tap_dance.length} tap dance entries were not imported`,
    })
  }

  if (data.combo && Array.isArray(data.combo) && data.combo.length > 0) {
    warnings.push({
      type: 'dropped-combo',
      message: `${data.combo.length} combo entries were not imported`,
    })
  }

  if (data.macro && Array.isArray(data.macro) && data.macro.length > 0) {
    warnings.push({
      type: 'dropped-macro',
      message: `${data.macro.length} macro entries were not imported`,
    })
  }

  if (data.encoder_layout && Array.isArray(data.encoder_layout)) {
    const hasEncoders = data.encoder_layout.some(
      (layer: unknown) => Array.isArray(layer) && layer.length > 0,
    )
    if (hasEncoders) {
      warnings.push({
        type: 'dropped-encoder',
        message: 'Encoder mappings were not imported',
      })
    }
  }

  return {
    keymap: {
      id: generateId('keymap'),
      name: 'VIAL Import',
      layers,
    },
    warnings,
    metadata: {
      sourceFormat: 'vial',
      totalKeycodes: totalCount,
      unmappedKeycodes: unmappedCount,
    },
  }
}
