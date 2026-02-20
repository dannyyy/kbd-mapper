import type { KeyBinding } from '../../types/keymap'
import type { ImportResult, ImportWarning } from '../../types/import'
import { generateId } from '../id'
import { getLayerColor } from '../defaults'
import { resolveZmkKeycode, resolveModifierName } from '../keycodes'

/**
 * Parse a ZMK .keymap file (devicetree format).
 *
 * This implements a subset of the devicetree parser sufficient to
 * extract the keymap node and its layer children. It handles:
 * - #define preprocessor directives (for layer names)
 * - Layer nodes with bindings properties
 * - Standard behaviors: &kp, &mt, &lt, &mo, &tog, &to, &trans, &none, &sk, &sl
 * - Custom hold-tap behaviors (resolved by compatible string)
 *
 * It does NOT handle:
 * - #include directives (assumes standard ZMK behaviors available)
 * - Combos, conditional layers, macros (warned and skipped)
 */
export function parseZmkKeymap(content: string): ImportResult {
  const warnings: ImportWarning[] = []

  // Step 1: Process #define directives for layer name constants
  const defines = parseDefines(content)

  // Step 2: Detect and warn about combos, macros, etc.
  if (content.includes('zmk,combos')) {
    warnings.push({
      type: 'dropped-combo',
      message: 'Combos are not imported (not representable per-key)',
    })
  }
  if (content.includes('zmk,behavior-macro')) {
    warnings.push({
      type: 'dropped-macro',
      message: 'Macros are not imported',
    })
  }
  if (content.includes('zmk,conditional-layers')) {
    warnings.push({
      type: 'unsupported-feature',
      message: 'Conditional layers are not imported',
    })
  }
  if (content.includes('sensor-bindings')) {
    warnings.push({
      type: 'dropped-encoder',
      message: 'Encoder/sensor bindings are not imported',
    })
  }

  // Step 3: Find custom hold-tap behaviors
  const customHoldTaps = parseCustomHoldTaps(content)

  // Step 4: Find custom tap-dance behaviors
  const customTapDances = parseTapDanceBehaviors(content)

  // Step 5: Extract keymap layers
  const keymapBlock = extractKeymapBlock(content)
  if (!keymapBlock) {
    throw new Error('Could not find keymap block in ZMK file')
  }

  const layerBlocks = extractLayerBlocks(keymapBlock)
  if (layerBlocks.length === 0) {
    throw new Error('No layers found in ZMK keymap')
  }

  let unmappedCount = 0
  let totalCount = 0

  const layers = layerBlocks.map((block, layerIndex) => {
    const bindings = parseBindings(
      block.bindings,
      defines,
      customHoldTaps,
      customTapDances,
      layerIndex,
      warnings,
    )
    totalCount += bindings.length
    unmappedCount += bindings.filter((b) => b.type === 'custom').length

    return {
      id: generateId('layer'),
      name:
        block.displayName ?? block.nodeName ?? (layerIndex === 0 ? 'Base' : `Layer ${layerIndex}`),
      color: getLayerColor(layerIndex),
      bindings,
      visible: true,
    }
  })

  return {
    keymap: {
      id: generateId('keymap'),
      name: 'ZMK Import',
      layers,
    },
    warnings,
    metadata: {
      sourceFormat: 'zmk-keymap',
      totalKeycodes: totalCount,
      unmappedKeycodes: unmappedCount,
    },
  }
}

// --- Internal helpers ---

interface LayerBlock {
  nodeName: string
  displayName?: string
  bindings: string
}

interface CustomHoldTap {
  name: string
  holdBehavior: string // e.g., "&kp" or "&mo"
  tapBehavior: string // e.g., "&kp"
}

/**
 * Parse #define NAME VALUE directives.
 */
function parseDefines(content: string): Record<string, string> {
  const defines: Record<string, string> = {}
  const defineRegex = /^\s*#define\s+(\w+)\s+(.+)$/gm
  let match
  while ((match = defineRegex.exec(content)) !== null) {
    defines[match[1]!] = match[2]!.trim()
  }
  return defines
}

/**
 * Find custom hold-tap behavior definitions to understand their semantics.
 */
function parseCustomHoldTaps(content: string): Map<string, CustomHoldTap> {
  const result = new Map<string, CustomHoldTap>()

  // Match behavior blocks like:
  // name: label {
  //   compatible = "zmk,behavior-hold-tap";
  //   bindings = <&kp>, <&kp>;
  // };
  const behaviorBlockRegex =
    /(\w+)\s*:\s*\w+\s*\{[^}]*compatible\s*=\s*"zmk,behavior-hold-tap"[^}]*\}/gs
  let match
  while ((match = behaviorBlockRegex.exec(content)) !== null) {
    const block = match[0]
    const name = match[1]!

    // Extract bindings
    const bindingsMatch = block.match(/bindings\s*=\s*<([^>]+)>\s*,\s*<([^>]+)>/)
    if (bindingsMatch) {
      result.set(name, {
        name,
        holdBehavior: bindingsMatch[1]!.trim(),
        tapBehavior: bindingsMatch[2]!.trim(),
      })
    }
  }

  return result
}

/**
 * Find tap-dance behavior definitions.
 */
function parseTapDanceBehaviors(content: string): Set<string> {
  const names = new Set<string>()
  const tdRegex = /(\w+)\s*:\s*\w+\s*\{[^}]*compatible\s*=\s*"zmk,behavior-tap-dance"[^}]*\}/gs
  let match
  while ((match = tdRegex.exec(content)) !== null) {
    names.add(match[1]!)
  }
  return names
}

/**
 * Extract the keymap { ... } block from the devicetree.
 */
function extractKeymapBlock(content: string): string | null {
  // Look for the keymap node with compatible = "zmk,keymap"
  const keymapRegex = /keymap\s*\{[^}]*compatible\s*=\s*"zmk,keymap"\s*;/s
  const startMatch = keymapRegex.exec(content)
  if (!startMatch) return null

  // Find the matching closing brace by counting braces
  const startIdx = content.indexOf('{', startMatch.index)
  if (startIdx === -1) return null

  let depth = 0
  for (let i = startIdx; i < content.length; i++) {
    if (content[i] === '{') depth++
    else if (content[i] === '}') {
      depth--
      if (depth === 0) {
        return content.substring(startIdx + 1, i)
      }
    }
  }

  return null
}

/**
 * Extract individual layer blocks from the keymap.
 */
function extractLayerBlocks(keymapContent: string): LayerBlock[] {
  const layers: LayerBlock[] = []

  // Match layer nodes: name { bindings = <...>; };
  // Use a state machine to handle nested braces
  const nodeStartRegex = /(\w+)\s*\{/g
  let match

  while ((match = nodeStartRegex.exec(keymapContent)) !== null) {
    const nodeName = match[1]!

    // Skip the compatible property node
    if (nodeName === 'compatible') continue

    // Find the matching closing brace
    const startIdx = keymapContent.indexOf('{', match.index)
    let depth = 0
    let endIdx = -1
    for (let i = startIdx; i < keymapContent.length; i++) {
      if (keymapContent[i] === '{') depth++
      else if (keymapContent[i] === '}') {
        depth--
        if (depth === 0) {
          endIdx = i
          break
        }
      }
    }

    if (endIdx === -1) continue

    const blockContent = keymapContent.substring(startIdx + 1, endIdx)

    // Extract bindings property
    const bindingsMatch = blockContent.match(/bindings\s*=\s*<([\s\S]*?)>\s*;/)
    if (!bindingsMatch) continue

    // Extract display-name if present
    const displayNameMatch = blockContent.match(/display-name\s*=\s*"([^"]*)"/)

    layers.push({
      nodeName,
      displayName: displayNameMatch?.[1],
      bindings: bindingsMatch[1]!,
    })
  }

  return layers
}

/**
 * Parse a bindings string like "&kp A &mt LSHFT B &trans &none"
 * into an array of KeyBindings.
 */
function parseBindings(
  bindingsStr: string,
  defines: Record<string, string>,
  customHoldTaps: Map<string, CustomHoldTap>,
  customTapDances: Set<string>,
  layerIndex: number,
  warnings: ImportWarning[],
): KeyBinding[] {
  const bindings: KeyBinding[] = []

  // Tokenize: split on whitespace, but group behavior references with their parameters
  // Behaviors start with & and take 0-2 parameters
  const tokens = bindingsStr.trim().split(/\s+/).filter(Boolean)

  let i = 0
  while (i < tokens.length) {
    const token = tokens[i]!

    if (!token.startsWith('&')) {
      // Skip non-behavior tokens (shouldn't happen in valid keymap)
      i++
      continue
    }

    const behaviorName = token.substring(1) // remove &

    // Determine how many parameters this behavior takes
    const paramCount = getBehaviorParamCount(behaviorName, customHoldTaps, customTapDances)

    const params: string[] = []
    for (let p = 0; p < paramCount && i + 1 + p < tokens.length; p++) {
      const nextToken = tokens[i + 1 + p]!
      // Stop if we hit another behavior reference
      if (nextToken.startsWith('&')) break
      params.push(nextToken)
    }

    const binding = resolveBehavior(
      behaviorName,
      params,
      defines,
      customHoldTaps,
      customTapDances,
      layerIndex,
      warnings,
    )
    bindings.push(binding)

    i += 1 + params.length
  }

  return bindings
}

/**
 * Determine how many parameters a behavior takes.
 */
function getBehaviorParamCount(
  name: string,
  customHoldTaps: Map<string, CustomHoldTap>,
  customTapDances: Set<string>,
): number {
  // Built-in behaviors
  switch (name) {
    case 'trans':
    case 'none':
    case 'caps_word':
    case 'key_repeat':
    case 'sys_reset':
    case 'bootloader':
      return 0
    case 'kp':
    case 'mo':
    case 'tog':
    case 'to':
    case 'sk':
    case 'sl':
      return 1
    case 'mt':
    case 'lt':
    case 'bt':
    case 'out':
      return 2
    default:
      // Custom hold-taps take 2 params
      if (customHoldTaps.has(name)) return 2
      // Custom tap-dances take 0 params
      if (customTapDances.has(name)) return 0
      // Unknown — guess 0
      return 0
  }
}

/**
 * Resolve a behavior and its parameters into a KeyBinding.
 */
function resolveBehavior(
  name: string,
  params: string[],
  defines: Record<string, string>,
  customHoldTaps: Map<string, CustomHoldTap>,
  customTapDances: Set<string>,
  layerIndex: number,
  warnings: ImportWarning[],
): KeyBinding {
  // Resolve define references in params
  const resolvedParams = params.map((p) => resolveDefine(p, defines))

  switch (name) {
    case 'trans':
      return { label: '▽', type: 'transparent' }

    case 'none':
      return { label: '', type: 'none' }

    case 'kp': {
      const keycode = resolvedParams[0] ?? ''
      const resolved = resolveZmkKeycode(keycode)
      if (resolved) return { ...resolved }
      warnings.push({
        type: 'unknown-keycode',
        message: `Unknown ZMK keycode "${keycode}"`,
        details: `Layer ${layerIndex}`,
      })
      return { label: keycode, type: 'custom' }
    }

    case 'mt': {
      // Mod-tap: &mt MODIFIER KEY
      const modKeycode = resolvedParams[0] ?? ''
      const tapKeycode = resolvedParams[1] ?? ''
      const modResolved = resolveModLabel(modKeycode)
      const tapResolved = resolveZmkKeycode(tapKeycode)
      return {
        label: tapResolved?.label ?? tapKeycode,
        type: 'mod-tap',
        holdLabel: modResolved,
        holdType: 'modifier',
      }
    }

    case 'lt': {
      // Layer-tap: &lt LAYER KEY
      const layerNum = resolvedParams[0] ?? '0'
      const tapKeycode = resolvedParams[1] ?? ''
      const tapResolved = resolveZmkKeycode(tapKeycode)
      return {
        label: tapResolved?.label ?? tapKeycode,
        type: 'layer-tap',
        holdLabel: `L${layerNum}`,
        holdType: 'layer-toggle',
      }
    }

    case 'mo': {
      const layerNum = resolvedParams[0] ?? '0'
      return { label: `L${layerNum}`, type: 'layer-toggle' }
    }

    case 'tog': {
      const layerNum = resolvedParams[0] ?? '0'
      return { label: `TG${layerNum}`, type: 'layer-toggle' }
    }

    case 'to': {
      const layerNum = resolvedParams[0] ?? '0'
      return { label: `TO${layerNum}`, type: 'layer-toggle' }
    }

    case 'sk': {
      // Sticky key (one-shot modifier)
      const modKeycode = resolvedParams[0] ?? ''
      const label = resolveModLabel(modKeycode)
      return { label: `OS:${label}`, type: 'modifier' }
    }

    case 'sl': {
      // Sticky layer (one-shot layer)
      const layerNum = resolvedParams[0] ?? '0'
      return { label: `OSL${layerNum}`, type: 'layer-toggle' }
    }

    case 'caps_word':
      return { label: 'CapsW', type: 'custom' }

    case 'key_repeat':
      return { label: 'Repeat', type: 'custom' }

    case 'sys_reset':
      return { label: 'Reset', type: 'custom' }

    case 'bootloader':
      return { label: 'Boot', type: 'custom' }

    case 'bt': {
      // Bluetooth: &bt BT_SEL 0, &bt BT_CLR, etc.
      const action = resolvedParams[0] ?? ''
      const param = resolvedParams[1]
      if (action === 'BT_SEL' && param !== undefined) {
        return { label: `BT${param}`, type: 'custom' }
      }
      if (action === 'BT_CLR') return { label: 'BTClr', type: 'custom' }
      if (action === 'BT_NXT') return { label: 'BTNxt', type: 'custom' }
      if (action === 'BT_PRV') return { label: 'BTPrv', type: 'custom' }
      return { label: `BT`, type: 'custom' }
    }

    case 'out': {
      const action = resolvedParams[0] ?? ''
      if (action === 'OUT_TOG') return { label: 'OutTog', type: 'custom' }
      if (action === 'OUT_USB') return { label: 'USB', type: 'custom' }
      if (action === 'OUT_BLE') return { label: 'BLE', type: 'custom' }
      return { label: 'Out', type: 'custom' }
    }

    default: {
      // Check custom hold-taps
      const ht = customHoldTaps.get(name)
      if (ht) {
        return resolveCustomHoldTap(ht, resolvedParams)
      }

      // Check custom tap-dances
      if (customTapDances.has(name)) {
        return { label: name, type: 'custom' }
      }

      // Unknown behavior
      warnings.push({
        type: 'unknown-keycode',
        message: `Unknown ZMK behavior "&${name}"`,
        details: `Layer ${layerIndex}, params: ${resolvedParams.join(' ')}`,
      })
      const label = resolvedParams.length > 0 ? `${name}(${resolvedParams.join(',')})` : name
      return { label, type: 'custom' }
    }
  }
}

/**
 * Resolve a custom hold-tap behavior.
 */
function resolveCustomHoldTap(ht: CustomHoldTap, params: string[]): KeyBinding {
  const holdParam = params[0] ?? ''
  const tapParam = params[1] ?? ''

  // If hold behavior is &kp, it's a mod-tap variant
  if (ht.holdBehavior === '&kp') {
    const modLabel = resolveModLabel(holdParam)
    const tapResolved = resolveZmkKeycode(tapParam)
    return {
      label: tapResolved?.label ?? tapParam,
      type: 'mod-tap',
      holdLabel: modLabel,
      holdType: 'modifier',
    }
  }

  // If hold behavior is &mo, it's a layer-tap variant
  if (ht.holdBehavior === '&mo') {
    const tapResolved = resolveZmkKeycode(tapParam)
    return {
      label: tapResolved?.label ?? tapParam,
      type: 'layer-tap',
      holdLabel: `L${holdParam}`,
      holdType: 'layer-toggle',
    }
  }

  // Generic: show as custom
  return {
    label: tapParam || holdParam,
    type: 'custom',
  }
}

/**
 * Resolve a define reference: if the value is a known define name,
 * return its value; otherwise return the original string.
 */
function resolveDefine(value: string, defines: Record<string, string>): string {
  return defines[value] ?? value
}

/**
 * Resolve a modifier keycode to a short label.
 */
function resolveModLabel(keycode: string): string {
  const mod = resolveModifierName(keycode)
  if (mod) return mod.label

  // Try common ZMK modifier shortcuts
  const zmkMods: Record<string, string> = {
    LSHFT: 'Shift',
    LSHIFT: 'Shift',
    LEFT_SHIFT: 'Shift',
    LCTRL: 'Ctrl',
    LEFT_CONTROL: 'Ctrl',
    LALT: 'Alt',
    LEFT_ALT: 'Alt',
    LGUI: 'GUI',
    LEFT_GUI: 'GUI',
    LCMD: 'Cmd',
    LEFT_COMMAND: 'Cmd',
    RSHFT: 'RShift',
    RSHIFT: 'RShift',
    RIGHT_SHIFT: 'RShift',
    RCTRL: 'RCtrl',
    RIGHT_CONTROL: 'RCtrl',
    RALT: 'RAlt',
    RIGHT_ALT: 'RAlt',
    RGUI: 'RGUI',
    RIGHT_GUI: 'RGUI',
  }
  return zmkMods[keycode] ?? keycode
}
