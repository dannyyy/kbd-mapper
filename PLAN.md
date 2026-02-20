# Multi-Format Configuration Import Support — Feasibility & Implementation Plan

## Executive Summary

Supporting external keyboard configuration formats is **feasible and a strong fit** for kbd-mapper's existing data model. The `KeyPosition` type already uses QMK-compatible coordinate units, and the `KeyBinding` type with its `holdLabel`/`holdType` fields can represent all dual-role key types across formats. The main work is building parsers and a keycode mapping table.

---

## Format Analysis

### Formats You Named

| Format                  | Type                 | Provides Layout?      | Provides Bindings?     | Parser Difficulty |
| ----------------------- | -------------------- | --------------------- | ---------------------- | ----------------- |
| **VIA/VIAL definition** | JSON + embedded KLE  | Yes                   | No (layout only)       | Medium            |
| **VIA keymap backup**   | JSON                 | No                    | Yes (integer keycodes) | Medium            |
| **ZMK Studio**          | Devicetree `.keymap` | No (separate `.dtsi`) | Yes                    | Hard              |

### Formats You Missed

| Format                | Type | Provides Layout?            | Provides Bindings?    | Parser Difficulty | Importance                       |
| --------------------- | ---- | --------------------------- | --------------------- | ----------------- | -------------------------------- |
| **QMK `keymap.json`** | JSON | No (separate `info.json`)   | Yes (string keycodes) | **Easy**          | **High — most popular firmware** |
| **QMK `info.json`**   | JSON | Yes (stateless coordinates) | No                    | Easy              | High (pairs with keymap.json)    |
| **KLE**               | JSON | Yes (delta-encoded)         | No (labels only)      | Medium            | High — universal layout exchange |

**QMK `keymap.json` is the single most impactful format to support.** It's the native output of QMK Configurator (the most popular keyboard configurator), uses simple flat JSON with string keycodes, and is trivial to parse compared to devicetree or integer-encoded VIA backups.

### Format Relationships

```
KLE JSON ──────────────> Physical Layout
    │
    ├── used by VIA/VIAL definition (embedded KLE for layout)
    │
QMK info.json ─────────> Physical Layout (stateless, easier than KLE)
QMK keymap.json ────────> Layers + Key Bindings (string keycodes)
VIA keymap backup ──────> Layers + Key Bindings (integer keycodes, needs lookup table)
ZMK .keymap ────────────> Layers + Key Bindings (devicetree syntax)
```

### Recommended Priority

1. **QMK `keymap.json`** — Easy to parse, covers the largest user base, string keycodes
2. **KLE JSON** — Physical layout import, enables VIA/VIAL layout support as a side effect
3. **QMK `info.json`** — Physical layout import, simpler than KLE, paired with keymap.json
4. **VIA keymap backup** — Integer keycodes need a mapping table, but same table used by QMK
5. **ZMK `.keymap`** — Hardest (devicetree parser), but important for the ZMK community

---

## Data Model Compatibility

### What Maps Cleanly

| Source Concept                        | kbd-mapper Target                                                                  | Notes                           |
| ------------------------------------- | ---------------------------------------------------------------------------------- | ------------------------------- |
| KLE/QMK `x, y, w, h, r, rx, ry`       | `KeyPosition`                                                                      | **Identical** coordinate system |
| QMK `KC_A`, ZMK `&kp A`               | `{ label: "A", type: "normal" }`                                                   | Need keycode→label table        |
| QMK `LSFT_T(KC_A)`, ZMK `&mt LSHFT A` | `{ label: "A", type: "mod-tap", holdLabel: "Shift", holdType: "modifier" }`        | Direct mapping                  |
| QMK `LT(1,KC_SPC)`, ZMK `&lt 1 SPACE` | `{ label: "Space", type: "layer-tap", holdLabel: "L1", holdType: "layer-toggle" }` | Direct mapping                  |
| QMK `KC_TRNS`, ZMK `&trans`           | `{ type: "transparent" }`                                                          | Direct mapping                  |
| QMK `KC_NO`, ZMK `&none`              | `{ type: "none" }`                                                                 | Direct mapping                  |
| QMK `MO(1)`, ZMK `&mo 1`              | `{ label: "L1", type: "layer-toggle" }`                                            | Direct mapping                  |
| QMK `KC_VOLU`, ZMK `C_VOL_UP`         | `{ label: "Vol+", type: "media" }`                                                 | Need keycode→label table        |

### What Doesn't Map (Lossy Import)

These features exist in QMK/ZMK but have no representation in kbd-mapper's current model:

| Feature                                                     | Workaround                                               |
| ----------------------------------------------------------- | -------------------------------------------------------- |
| **Combos**                                                  | Drop on import (not visualizable on a per-key basis)     |
| **Tap Dance**                                               | Import as `type: "custom"` with descriptive label        |
| **Macros**                                                  | Import as `type: "custom"` with label like "Macro 1"     |
| **One-shot keys** (`OSM`, `OSL`, `&sk`, `&sl`)              | Import as modifier/layer-toggle with a label hint        |
| **Custom hold-tap flavors** (ZMK `flavor: "balanced"` etc.) | Lose timing config, import as standard mod-tap/layer-tap |
| **Conditional layers** (ZMK)                                | Drop (not per-key)                                       |
| **Encoder bindings**                                        | Drop (no rotary encoder concept in kbd-mapper)           |

This is acceptable — kbd-mapper is a **visualizer**, not a firmware editor. Lossy import of advanced features is expected and fine.

---

## Implementation Plan

### Phase 1: Core Infrastructure

#### 1.1 Keycode Mapping Table (`src/utils/keycodes.ts`)

A central mapping from firmware keycode names to human-readable labels and KeyTypes:

```typescript
interface KeycodeEntry {
  label: string // Human display: "A", "Shift", "Vol+"
  type: KeyType // "normal", "modifier", "media", etc.
  aliases?: string[] // Alternate names (QMK aliases)
}

// ~300 entries covering all standard keycodes
const QMK_KEYCODES: Record<string, KeycodeEntry> = {
  KC_A: { label: 'A', type: 'normal' },
  KC_LSFT: { label: 'Shift', type: 'modifier', aliases: ['KC_LSHIFT'] },
  KC_VOLU: { label: 'Vol+', type: 'media' },
  KC_LEFT: { label: 'Left', type: 'navigation' },
  KC_F1: { label: 'F1', type: 'function' },
  // ...
}

// ZMK uses different names — map ZMK→QMK first, then reuse the table
const ZMK_TO_QMK: Record<string, string> = {
  A: 'KC_A',
  LSHFT: 'KC_LSFT',
  C_VOL_UP: 'KC_VOLU',
  // ...
}
```

Also need a reverse table for VIA integer keycodes (16-bit → keycode name). QMK publishes this at their API.

#### 1.2 Import Result Type (`src/types/import.ts`)

```typescript
interface ImportResult {
  layout?: PhysicalLayout      // Physical layout if the format provides one
  keymap?: Keymap              // Keymap with layers/bindings
  warnings: ImportWarning[]    // Non-fatal issues (unknown keycodes, dropped combos, etc.)
  metadata: {
    sourceFormat: string       // "qmk-json" | "via-backup" | "zmk-keymap" | "kle"
    keyboardName?: string
    originalKeycodeCount?: number
    unmappedKeycodeCount?: number
  }
}

interface ImportWarning {
  type: 'unknown-keycode' | 'dropped-combo' | 'dropped-tapdance' | 'key-count-mismatch' | ...
  message: string
  details?: string
}
```

### Phase 2: Format Parsers (`src/utils/parsers/`)

#### 2.1 QMK `keymap.json` Parser

**Complexity: Low** — ~200 lines

- Parse JSON, extract `layers` array
- For each keycode string, parse with regex:
  - Plain: `KC_A` → lookup in keycode table
  - Mod-tap: `LSFT_T(KC_A)` or `MT(MOD_LCTL, KC_A)` → extract mod + key
  - Layer-tap: `LT(1, KC_SPC)` → extract layer + key
  - Layer keys: `MO(1)`, `TG(1)`, `TO(1)` → layer-toggle
  - Modified: `LCTL(KC_C)` → label as "Ctrl+C", type normal
- Return `ImportResult` with keymap (no layout)

#### 2.2 KLE JSON Parser

**Complexity: Medium** — ~150 lines, or use `kle-serial` npm package

- Parse the delta-encoded row format
- Extract `x, y, w, h, r, rx, ry` for each key → `KeyPosition[]`
- Extract labels (for informational display, not binding data)
- Return `ImportResult` with layout (no keymap)

Using the `kle-serial` npm package (MIT, 0 dependencies) is recommended over writing a custom parser — it handles all edge cases including the tricky property inheritance.

#### 2.3 QMK `info.json` Layout Parser

**Complexity: Low** — ~50 lines

- Parse JSON, find `layouts.LAYOUT.layout` (or first layout)
- Each entry already has stateless `x, y, w, h, r, rx, ry` + `matrix`
- Map directly to `KeyPosition[]`
- Return `ImportResult` with layout (no keymap)

#### 2.4 VIA Keymap Backup Parser

**Complexity: Medium** — ~150 lines

- Parse JSON, extract `layers` (arrays of integers)
- Decode 16-bit integer keycodes using QMK's published keycode table
- Handle mod-tap/layer-tap bit encoding (bits 15-8 encode type, bits 7-0 encode basic keycode)
- Return `ImportResult` with keymap (no layout)

#### 2.5 ZMK `.keymap` Parser

**Complexity: High** — ~400-500 lines

- Implement a basic devicetree tokenizer (not full parser — only need `keymap` and `behaviors` nodes)
- Handle `#define` preprocessor directives for layer names
- Skip `#include` (assume standard behaviors available)
- Parse layer nodes: extract `bindings` property, tokenize `&behavior param1 param2` entries
- Map behaviors: `&kp`→normal, `&mt`→mod-tap, `&lt`→layer-tap, `&mo`→layer-toggle, `&trans`→transparent, `&none`→none
- Handle custom behaviors by resolving their `compatible` property to determine base type
- Map ZMK keycode names → labels using the ZMK→QMK translation table
- Return `ImportResult` with keymap (no layout)

Reference implementation: [keymap-drawer](https://github.com/caksoylar/keymap-drawer) (Python, parses ZMK keymaps)

### Phase 3: Auto-Detection & Unified Import

#### 3.1 Format Auto-Detection (`src/utils/parsers/detect.ts`)

```typescript
function detectFormat(content: string, filename: string): DetectedFormat {
  // By file extension
  if (filename.endsWith('.keymap')) return 'zmk-keymap'

  // Try JSON parse
  const json = JSON.parse(content)

  // QMK keymap.json: has "keyboard", "keymap", "layers" with string arrays
  if (json.keyboard && json.layers && typeof json.layers[0]?.[0] === 'string') return 'qmk-keymap'

  // QMK info.json: has "layouts" with "layout" arrays containing {x, y, matrix}
  if (json.layouts && Object.values(json.layouts)[0]?.layout?.[0]?.matrix) return 'qmk-info'

  // VIA/VIAL definition: has "vendorId", "productId", "layouts.keymap" (KLE array)
  if (json.vendorId && json.layouts?.keymap) return 'via-definition'

  // VIA backup: has "vendorProductId", "layers" with integer arrays
  if (json.vendorProductId && json.layers && typeof json.layers[0]?.[0] === 'number')
    return 'via-backup'

  // KLE: top-level array, first element is metadata object or row array
  if (Array.isArray(json)) return 'kle'

  // kbd-mapper native
  if (json.keymap?.layers && json.layout?.keys) return 'kbd-mapper'

  return 'unknown'
}
```

#### 3.2 Unified Import Function

```typescript
async function importFile(content: string, filename: string): Promise<ImportResult> {
  const format = detectFormat(content, filename)
  switch (format) {
    case 'qmk-keymap':
      return parseQmkKeymap(content)
    case 'qmk-info':
      return parseQmkInfo(content)
    case 'via-definition':
      return parseViaDefinition(content)
    case 'via-backup':
      return parseViaBackup(content)
    case 'kle':
      return parseKle(content)
    case 'zmk-keymap':
      return parseZmkKeymap(content)
    case 'kbd-mapper':
      return parseNative(content)
    default:
      throw new Error('Unrecognized file format')
  }
}
```

### Phase 4: UI Changes

#### 4.1 Enhanced Load Button / Import Dialog

The current "Load" button opens a file picker for `.json` only. This needs to change:

**Option A (Minimal):** Expand the file picker to accept `.json` and `.keymap`, then auto-detect the format after loading. Show a result dialog with warnings.

**Option B (Full dialog — Recommended):** Replace the single "Load" button with an "Import" action that opens a modal dialog:

```
┌─────────────────────────────────────────────────┐
│  Import Keymap                              [X] │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌─────────────────────────────────────────┐    │
│  │  Drop file here or click to browse      │    │
│  │                                         │    │
│  │  Supported: .json, .keymap              │    │
│  └─────────────────────────────────────────┘    │
│                                                 │
│  ── or select format manually ──                │
│                                                 │
│  ○ Auto-detect (recommended)                    │
│  ○ kbd-mapper Project (.json)                   │
│  ○ QMK Keymap (.json)                           │
│  ○ QMK Keyboard Info (.json)                    │
│  ○ VIA/VIAL Definition (.json)                  │
│  ○ VIA Keymap Backup (.json)                    │
│  ○ ZMK Keymap (.keymap)                         │
│  ○ KLE Layout (.json)                           │
│                                                 │
├─────────────────────────────────────────────────┤
│  [Cancel]                          [Import]     │
└─────────────────────────────────────────────────┘
```

#### 4.2 Import Result / Warnings Dialog

After parsing, show what was imported and any warnings:

```
┌─────────────────────────────────────────────────┐
│  Import Results                             [X] │
├─────────────────────────────────────────────────┤
│                                                 │
│  ✓ Detected format: QMK Keymap JSON             │
│  ✓ Imported 4 layers with 42 keys each          │
│                                                 │
│  ⚠ 3 warnings:                                  │
│    • Unknown keycode "CUSTOM_1" on L0 key 5     │
│      → imported as empty binding                │
│    • 2 combos were skipped (not supported)      │
│    • Tap dance TD(0) imported as "TD0"          │
│                                                 │
│  Physical layout:                               │
│  ○ Keep current layout (Corne 3×6+3, 42 keys)  │
│  ○ Use layout from file (if available)          │
│  ○ Choose different layout...                   │
│                                                 │
│  ⚠ Key count mismatch: file has 36 keys,        │
│    current layout has 42 keys. Extra positions  │
│    will use empty bindings.                     │
│                                                 │
├─────────────────────────────────────────────────┤
│  [Cancel]                          [Apply]      │
└─────────────────────────────────────────────────┘
```

#### 4.3 Layout Matching on Import

When the imported file provides only bindings (no layout), the user must match it to a physical layout. Options:

1. **Keep current layout** — if key counts match, directly apply. If mismatched, pad/truncate with warnings.
2. **Choose layout** — open the existing LayoutSelector modal to pick a layout first, then apply bindings.
3. **Import layout from file** — if the format includes layout data (KLE, QMK info.json, VIA/VIAL definition), use it to create a user physical layout.

#### 4.4 Toolbar Changes

Current toolbar: `[New] [Save] [Load] | [Layout] | [Export]`

Proposed: `[New] [Save] [Import ▾] | [Layout] | [Export]`

The "Import" button could be a dropdown or just the enhanced dialog. "Save" continues to save in kbd-mapper native format. Keeping backwards compatibility with the existing "Load" behavior for `.json` files that are detected as kbd-mapper native format.

#### 4.5 Export to External Formats (Future / Out of Scope for Now)

Exporting _to_ QMK/ZMK/VIA is a separate and more complex feature (you need to generate valid firmware config from the visual representation). I recommend treating this as a separate future feature. The current export (SVG/PNG/PDF) already covers the primary use case of visualization.

---

## Key Decisions & Trade-offs

### 1. Should we use the `kle-serial` npm package?

**Recommendation: Yes.** It's MIT licensed, zero dependencies, maintained, and handles all KLE edge cases. Rolling our own KLE parser risks subtle bugs with the delta-encoding format.

### 2. How to handle key count mismatches?

When a keymap has 36 keys but the current layout has 42, or vice versa:

- **Fewer keys in file than layout:** Pad remaining positions with empty bindings
- **More keys in file than layout:** Truncate with a warning
- **Display warning** in the import result dialog so the user knows

The existing `LayoutSelector.vue` spatial proximity mapping could be adapted for this.

### 3. Where does the keycode table come from?

**Recommendation: Bundle a static table** (~300 entries) covering standard QMK keycodes. This avoids runtime API calls and works offline. The table can be maintained as a TypeScript const object.

### 4. ZMK parser scope?

**Recommendation: Parse the common subset.** Handle `&kp`, `&mt`, `&lt`, `&mo`, `&tog`, `&to`, `&trans`, `&none`, `&sk`, `&sl`, and simple custom hold-tap behaviors. Skip `#include` resolution (assume standard ZMK behaviors). Warn on unrecognized behaviors. This covers ~95% of real-world keymaps.

---

## Suggested Implementation Order

| Step | What                          | Adds Value                     |
| ---- | ----------------------------- | ------------------------------ |
| 1    | Keycode mapping table         | Foundation for all parsers     |
| 2    | Import result types           | Foundation for UI              |
| 3    | QMK `keymap.json` parser      | Covers largest user base       |
| 4    | Format auto-detection         | Smart import UX                |
| 5    | Import dialog UI (basic)      | User can import QMK files      |
| 6    | Import warnings dialog        | User sees what happened        |
| 7    | KLE parser (via `kle-serial`) | Physical layout import         |
| 8    | QMK `info.json` parser        | Physical layout import         |
| 9    | VIA/VIAL definition parser    | Layout import via embedded KLE |
| 10   | VIA keymap backup parser      | Integer keycode decoding       |
| 11   | ZMK `.keymap` parser          | Devicetree parsing             |
| 12   | Import dialog refinements     | Layout matching, drag-drop     |

---

## Summary

**Is it feasible?** Yes. The kbd-mapper data model is well-suited for this — `KeyPosition` uses QMK-compatible units and `KeyBinding` can represent all standard dual-role key types.

**What formats to support?** QMK JSON (highest priority, easiest), KLE (physical layouts), VIA/VIAL (popular configurators), ZMK (growing community, hardest parser).

**What did you miss?** QMK `keymap.json` and `info.json` — these are arguably the most important formats since QMK is the dominant firmware. KLE is also important as the universal layout exchange format used by VIA/VIAL.

**What about export?** Exporting _to_ firmware formats is out of scope for now. kbd-mapper is a visualizer — importing configs for visualization is the natural direction. SVG/PNG/PDF export already covers the output side.
