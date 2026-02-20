import type { KeyBinding } from '../../types/keymap'
import type { ImportResult, ImportWarning } from '../../types/import'
import { generateId } from '../id'
import { getLayerColor } from '../defaults'
import { decodeViaKeycode } from '../keycodes'
import { parseQmkKeycodeString } from './qmk-keymap'

/**
 * Parse a VIAL saved layout (.vil) file.
 *
 * VIAL .vil files are JSON with a 3D layout array [layer][row][col].
 * Keycodes can be either QMK keycode strings ("KC_A", "LCTL_T(KC_A)")
 * or 16-bit integers, depending on the VIAL version. Entries of -1 are
 * matrix placeholders and are skipped.
 */
export function parseVial(content: string): ImportResult {
  const data = JSON.parse(content)
  const warnings: ImportWarning[] = []

  if (!data.layout || !Array.isArray(data.layout)) {
    throw new Error('Invalid VIAL file: missing "layout" array')
  }

  // Flatten [layer][row][col] → [layer][keys], skipping -1 placeholders
  const layerArrays: (string | number)[][] = (data.layout as unknown[][][]).map((layer) =>
    layer
      .flat()
      .filter(
        (v): v is string | number => (typeof v === 'string' || typeof v === 'number') && v !== -1,
      ),
  )

  if (layerArrays.length === 0) {
    throw new Error('Invalid VIAL file: no layers found')
  }

  let unmappedCount = 0
  let totalCount = 0

  const layers = layerArrays.map((keycodes, layerIndex) => {
    const bindings: KeyBinding[] = keycodes.map((value, keyIndex) => {
      totalCount++

      // String keycodes: parse directly as QMK keycode strings
      if (typeof value === 'string') {
        // Handle hex-string custom keycodes like "0x7e40"
        if (value.startsWith('0x') || value.startsWith('0X')) {
          const numValue = parseInt(value, 16)
          if (!isNaN(numValue)) {
            const decoded = decodeViaKeycode(numValue)
            if (decoded) {
              const { binding, warning } = parseQmkKeycodeString(decoded)
              if (warning) {
                unmappedCount++
                warnings.push({
                  type: 'unknown-keycode',
                  message: warning,
                  details: `Layer ${layerIndex}, key ${keyIndex}, decoded as ${decoded}`,
                })
              }
              return binding
            }
          }
          unmappedCount++
          warnings.push({
            type: 'unknown-keycode',
            message: `Unknown VIAL keycode ${value}`,
            details: `Layer ${layerIndex}, key ${keyIndex}`,
          })
          return { label: value.toUpperCase(), type: 'custom' as const }
        }

        const { binding, warning } = parseQmkKeycodeString(value)
        if (warning) {
          unmappedCount++
          warnings.push({
            type: 'unknown-keycode',
            message: warning,
            details: `Layer ${layerIndex}, key ${keyIndex}`,
          })
        }
        return binding
      }

      // Integer keycodes: decode via VIA keycode table
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

  // Count non-empty tap dance entries
  const activeTapDances =
    data.tap_dance && Array.isArray(data.tap_dance)
      ? data.tap_dance.filter(
          (td: unknown) =>
            Array.isArray(td) && td.some((v: unknown) => typeof v === 'string' && v !== 'KC_NO'),
        ).length
      : 0

  if (activeTapDances > 0) {
    warnings.push({
      type: 'dropped-tapdance',
      message: `${activeTapDances} tap dance entries were not imported`,
    })
  }

  // Count non-empty combo entries
  const activeCombos =
    data.combo && Array.isArray(data.combo)
      ? data.combo.filter(
          (c: unknown) =>
            Array.isArray(c) && c.some((v: unknown) => typeof v === 'string' && v !== 'KC_NO'),
        ).length
      : 0

  if (activeCombos > 0) {
    warnings.push({
      type: 'dropped-combo',
      message: `${activeCombos} combo entries were not imported`,
    })
  }

  // Count non-empty macro entries
  const activeMacros =
    data.macro && Array.isArray(data.macro)
      ? data.macro.filter((m: unknown) => Array.isArray(m) && m.length > 0).length
      : 0

  if (activeMacros > 0) {
    warnings.push({
      type: 'dropped-macro',
      message: `${activeMacros} macro entries were not imported`,
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
