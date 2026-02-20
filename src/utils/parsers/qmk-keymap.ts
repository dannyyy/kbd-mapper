import type { KeyBinding } from '../../types/keymap'
import type { ImportResult, ImportWarning } from '../../types/import'
import { generateId } from '../id'
import { getLayerColor } from '../defaults'
import { resolveQmkKeycode, MOD_TAP_PREFIXES } from '../keycodes'

/**
 * Parse a QMK keycode string like "KC_A", "LT(1,KC_SPC)", "LSFT_T(KC_A)" etc.
 * into a KeyBinding.
 */
export function parseQmkKeycodeString(raw: string): { binding: KeyBinding; warning?: string } {
  const trimmed = raw.trim()

  // Transparent
  if (trimmed === 'KC_TRNS' || trimmed === 'KC_TRANSPARENT' || trimmed === '_______') {
    return { binding: { label: '▽', type: 'transparent' } }
  }

  // None
  if (trimmed === 'KC_NO' || trimmed === 'XXXXXXX') {
    return { binding: { label: '', type: 'none' } }
  }

  // Layer-tap: LT(layer, keycode)
  const ltMatch = trimmed.match(/^LT\(\s*(\d+)\s*,\s*(.+)\s*\)$/)
  if (ltMatch) {
    const layer = ltMatch[1]!
    const innerKeycode = ltMatch[2]!.trim()
    const resolved = resolveQmkKeycode(innerKeycode)
    return {
      binding: {
        label: resolved?.label ?? innerKeycode,
        type: 'layer-tap',
        holdLabel: `L${layer}`,
        holdType: 'layer-toggle',
      },
    }
  }

  // Mod-tap convenience macros: LSFT_T(KC_A), RCTL_T(KC_B), etc.
  const modTapMatch = trimmed.match(/^([A-Z_]+_T)\(\s*(.+)\s*\)$/)
  if (modTapMatch) {
    const modFunc = modTapMatch[1]!
    const innerKeycode = modTapMatch[2]!.trim()
    const modLabel = MOD_TAP_PREFIXES[modFunc]
    if (modLabel) {
      const resolved = resolveQmkKeycode(innerKeycode)
      return {
        binding: {
          label: resolved?.label ?? innerKeycode,
          type: 'mod-tap',
          holdLabel: modLabel,
          holdType: 'modifier',
        },
      }
    }
  }

  // Generic mod-tap: MT(mod, keycode)
  const mtMatch = trimmed.match(/^MT\(\s*(.+?)\s*,\s*(.+)\s*\)$/)
  if (mtMatch) {
    const modStr = mtMatch[1]!.trim()
    const innerKeycode = mtMatch[2]!.trim()
    const resolved = resolveQmkKeycode(innerKeycode)
    // Parse mod string — could be like MOD_LCTL|MOD_LSFT or a numeric value
    const modParts = modStr.split('|').map((s) => s.trim())
    const modLabels = modParts
      .map((p) => {
        if (p === 'MOD_LSFT') return 'S'
        if (p === 'MOD_LCTL') return 'C'
        if (p === 'MOD_LALT') return 'A'
        if (p === 'MOD_LGUI') return 'G'
        if (p === 'MOD_RSFT') return 'RS'
        if (p === 'MOD_RCTL') return 'RC'
        if (p === 'MOD_RALT') return 'RA'
        if (p === 'MOD_RGUI') return 'RG'
        if (p === 'MOD_HYPR') return 'Hypr'
        if (p === 'MOD_MEH') return 'Meh'
        return p
      })
      .join('+')
    return {
      binding: {
        label: resolved?.label ?? innerKeycode,
        type: 'mod-tap',
        holdLabel: modLabels,
        holdType: 'modifier',
      },
    }
  }

  // Momentary layer: MO(layer)
  const moMatch = trimmed.match(/^MO\(\s*(\d+)\s*\)$/)
  if (moMatch) {
    return {
      binding: { label: `L${moMatch[1]}`, type: 'layer-toggle' },
    }
  }

  // Toggle layer: TG(layer)
  const tgMatch = trimmed.match(/^TG\(\s*(\d+)\s*\)$/)
  if (tgMatch) {
    return {
      binding: { label: `TG${tgMatch[1]}`, type: 'layer-toggle' },
    }
  }

  // To layer: TO(layer)
  const toMatch = trimmed.match(/^TO\(\s*(\d+)\s*\)$/)
  if (toMatch) {
    return {
      binding: { label: `TO${toMatch[1]}`, type: 'layer-toggle' },
    }
  }

  // One-shot layer: OSL(layer)
  const oslMatch = trimmed.match(/^OSL\(\s*(\d+)\s*\)$/)
  if (oslMatch) {
    return {
      binding: { label: `OSL${oslMatch[1]}`, type: 'layer-toggle' },
    }
  }

  // One-shot mod: OSM(mod)
  const osmMatch = trimmed.match(/^OSM\(\s*(.+)\s*\)$/)
  if (osmMatch) {
    const modStr = osmMatch[1]!.trim()
    const modLabel =
      modStr === 'MOD_LSFT'
        ? 'Shift'
        : modStr === 'MOD_LCTL'
          ? 'Ctrl'
          : modStr === 'MOD_LALT'
            ? 'Alt'
            : modStr === 'MOD_LGUI'
              ? 'GUI'
              : modStr
    return {
      binding: { label: `OS:${modLabel}`, type: 'modifier' },
    }
  }

  // Layer-momentary with modifier: LM(layer, mod)
  const lmMatch = trimmed.match(/^LM\(\s*(\d+)\s*,\s*(.+)\s*\)$/)
  if (lmMatch) {
    return {
      binding: { label: `LM${lmMatch[1]}`, type: 'layer-toggle' },
    }
  }

  // Modified key: LCTL(KC_C), LSFT(KC_1), S(KC_A), etc.
  const modKeyMatch = trimmed.match(
    /^(LCTL|LSFT|LALT|LGUI|RCTL|RSFT|RALT|RGUI|HYPR|MEH|LSG|LCA|LAG|LCAG|LCG|LCS|LSA|RCS|SGUI|SCMD|SWIN|C_S|C|S|A|G)\(\s*(.+)\s*\)$/,
  )
  if (modKeyMatch) {
    const modName = modKeyMatch[1]!
    const innerKeycode = modKeyMatch[2]!.trim()
    const resolved = resolveQmkKeycode(innerKeycode)
    const modShort =
      {
        LCTL: 'C',
        C: 'C',
        LSFT: 'S',
        S: 'S',
        LALT: 'A',
        A: 'A',
        LGUI: 'G',
        G: 'G',
        RCTL: 'RC',
        RSFT: 'RS',
        RALT: 'RA',
        RGUI: 'RG',
        HYPR: 'Hypr',
        MEH: 'Meh',
        LSG: 'S+G',
        SGUI: 'S+G',
        SCMD: 'S+G',
        SWIN: 'S+G',
        LCA: 'C+A',
        LAG: 'A+G',
        LCAG: 'C+A+G',
        LCG: 'C+G',
        LCS: 'C+S',
        C_S: 'C+S',
        LSA: 'S+A',
        RCS: 'RC+RS',
      }[modName] ?? modName
    return {
      binding: {
        label: `${modShort}+${resolved?.label ?? innerKeycode}`,
        type: resolved?.type ?? 'normal',
      },
    }
  }

  // Tap dance: TD(n)
  const tdMatch = trimmed.match(/^TD\(\s*(\d+)\s*\)$/)
  if (tdMatch) {
    return {
      binding: { label: `TD${tdMatch[1]}`, type: 'custom' },
      warning: `Tap dance TD(${tdMatch[1]}) imported as custom key`,
    }
  }

  // Simple keycode lookup
  const resolved = resolveQmkKeycode(trimmed)
  if (resolved) {
    return { binding: { ...resolved } }
  }

  // Unrecognized — import as custom with raw label
  return {
    binding: { label: trimmed, type: 'custom' },
    warning: `Unknown keycode "${trimmed}"`,
  }
}

/**
 * Parse a QMK keymap.json file.
 *
 * Expected structure:
 * {
 *   "keyboard": "corne",
 *   "keymap": "default",
 *   "layout": "LAYOUT",
 *   "layers": [
 *     ["KC_Q", "KC_W", ...],
 *     ["KC_TRNS", ...]
 *   ]
 * }
 */
export function parseQmkKeymap(content: string): ImportResult {
  const data = JSON.parse(content)
  const warnings: ImportWarning[] = []

  if (!data.layers || !Array.isArray(data.layers)) {
    throw new Error('Invalid QMK keymap: missing "layers" array')
  }

  let unmappedCount = 0
  let totalCount = 0

  const layers = (data.layers as string[][]).map((layerKeycodes, layerIndex) => {
    const bindings: KeyBinding[] = layerKeycodes.map((keycode) => {
      totalCount++
      const { binding, warning } = parseQmkKeycodeString(keycode)
      if (warning) {
        unmappedCount++
        warnings.push({
          type: 'unknown-keycode',
          message: warning,
          details: `Layer ${layerIndex}, keycode: ${keycode}`,
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
      name: data.keymap ?? 'Imported Keymap',
      layers,
    },
    warnings,
    metadata: {
      sourceFormat: 'qmk-keymap',
      keyboardName: data.keyboard,
      totalKeycodes: totalCount,
      unmappedKeycodes: unmappedCount,
    },
  }
}
