import type { ImportFormat } from '../../types/import'

/**
 * Auto-detect the format of a keyboard configuration file
 * from its content and filename.
 */
export function detectFormat(content: string, filename: string): ImportFormat {
  // ZMK keymap files use .keymap extension (devicetree)
  if (filename.endsWith('.keymap')) {
    return 'zmk-keymap'
  }

  // VIAL saved layout files use .vil extension
  if (filename.endsWith('.vil')) {
    return 'vial'
  }

  // Try to parse as JSON
  let json: unknown
  try {
    json = JSON.parse(content)
  } catch {
    // Not valid JSON — could be ZMK devicetree even without .keymap extension
    if (content.includes('zmk,keymap') || content.includes('compatible = "zmk,keymap"')) {
      return 'zmk-keymap'
    }
    return 'unknown'
  }

  if (typeof json !== 'object' || json === null) {
    return 'unknown'
  }

  // kbd-mapper native project: has keymap.layers AND layout.keys
  if (isRecord(json) && isRecord(json.keymap) && isRecord(json.layout)) {
    const keymap = json.keymap
    const layout = json.layout
    if (Array.isArray(keymap.layers) && Array.isArray(layout.keys)) {
      return 'kbd-mapper'
    }
  }

  // QMK keymap.json: has "keyboard" (string), "layers" (array of string arrays)
  if (isRecord(json) && typeof json.keyboard === 'string' && Array.isArray(json.layers)) {
    const firstLayer = json.layers[0]
    if (
      Array.isArray(firstLayer) &&
      (firstLayer.length === 0 || typeof firstLayer[0] === 'string')
    ) {
      return 'qmk-keymap'
    }
  }

  // QMK info.json: has "layouts" object containing layout arrays with matrix entries
  if (isRecord(json) && isRecord(json.layouts)) {
    const layoutValues = Object.values(json.layouts)
    if (layoutValues.length > 0) {
      const first = layoutValues[0]
      if (isRecord(first) && Array.isArray(first.layout)) {
        const firstKey = first.layout[0]
        if (isRecord(firstKey) && 'matrix' in firstKey && 'x' in firstKey) {
          return 'qmk-info'
        }
      }
    }
  }

  // VIA/VIAL definition: has "vendorId" AND "layouts.keymap" (KLE array)
  if (isRecord(json) && ('vendorId' in json || 'productId' in json)) {
    if (isRecord(json.layouts) && Array.isArray(json.layouts.keymap)) {
      return 'via-definition'
    }
  }

  // VIA keymap backup: has "vendorProductId" (number) AND "layers" (arrays of numbers)
  if (isRecord(json) && 'vendorProductId' in json && Array.isArray(json.layers)) {
    const firstLayer = json.layers[0]
    if (
      Array.isArray(firstLayer) &&
      (firstLayer.length === 0 || typeof firstLayer[0] === 'number')
    ) {
      return 'via-backup'
    }
  }

  // VIAL saved layout: has "version", "uid", and "layout" as 3D array [layer][row][col]
  if (isRecord(json) && 'uid' in json && 'version' in json && Array.isArray(json.layout)) {
    const firstLayer = json.layout[0]
    if (Array.isArray(firstLayer) && Array.isArray(firstLayer[0])) {
      return 'vial'
    }
  }

  // KLE: top-level JSON array
  if (Array.isArray(json)) {
    // KLE is an array of rows (arrays) with an optional metadata object first
    const hasRows = json.some((item) => Array.isArray(item))
    if (hasRows) {
      return 'kle'
    }
  }

  return 'unknown'
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}
