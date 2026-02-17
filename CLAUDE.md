# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev           # Start Vite dev server (default port 5173)
pnpm build         # Type-check (vue-tsc) then build for production
pnpm typecheck     # Type-check only (vue-tsc -b)
pnpm lint          # ESLint
pnpm lint:fix      # ESLint with auto-fix
pnpm format        # Prettier write
pnpm format:check  # Prettier check
```

ESLint and Prettier are configured. No test framework is configured. CI (GitHub Actions) enforces `pnpm lint`, `pnpm format:check`, `pnpm typecheck`, and `pnpm build` on every PR.

## Architecture

Browser-based keyboard layout visualizer and editor for custom keyboard enthusiasts. Renders multi-layer keymaps as SVG with theme support and exports to SVG/PNG/PDF. Fully client-side, no backend.

**Stack:** Vue 3 (Composition API, `<script setup>`) + TypeScript + Vite + Pinia

### Data Model

The core domain has four types (in `src/types/`):

- **PhysicalLayout** — Key positions (`KeyPosition`: x, y, w, h, r, rx, ry) in QMK-compatible units. 9 builtin layouts in `src/data/layouts/` (Iris SE/CE/LM share one layout).
- **Keymap** — Named collection of Layers. Each Layer has an array of KeyBindings (one per physical key position, same index) and a `visible` boolean controlling render inclusion.
- **KeyBinding** — Label + KeyType (normal, modifier, layer-toggle, layer-tap, mod-tap, transparent, none, media, navigation, function, custom). Dual-role keys have holdLabel/holdType.
- **Theme** — Colors, typography (`KeyStyle`), layout spacing. Drives SVG inline attributes (not CSS) so exports match the editor exactly. 5 builtin themes in `src/data/themes/`.

These are composed into a **Project** (`src/types/project.ts`) which is the unit of persistence. `Project.settings` includes `renderMode: 'compact' | 'expanded' | 'auto'` and `showLayerColors: boolean`.

### State Management (Pinia)

Three stores in `src/stores/`:

- **project** — The Project state (layout + keymap + settings). Persisted to localStorage via `pinia-plugin-persistedstate`. Contains all layer/key CRUD actions including `reorderLayer()` for drag-reordering layers (base layer at index 0 is protected).
- **editor** — UI-only state: selection, zoom/pan, dialog visibility, sidebar tab. Not persisted.
- **theme** — Current theme ID + user-created themes. Persisted separately.

**Critical pattern:** Builtin layout/theme objects from `src/data/` must never be directly assigned to the reactive store. Always deep-clone first, because pinia-persist hydration mutates objects in-place.

### Rendering Pipeline

All rendering is SVG via Vue templates (no canvas/D3):

1. **KeyboardRenderer** (`components/canvas/`) decides compact vs expanded mode. In `auto` mode, the project store uses visible layer count (<=5 = compact). Users can also force compact or expanded via `renderMode` setting.
2. **KeyboardSvg** computes viewBox bounds using `src/utils/coordinates.ts`, iterates keys.
3. **KeyCap** renders each key: `<rect>` background styled by theme + key type, `<text>` legends positioned by `useKeyRenderer.computeLegendPlacements()`.

**Compact mode legend layout:** Base layer center (large), hold label top-center (small), layers 1-4 in corners with colored indicators.

**Expanded mode:** One full keyboard per layer, stacked vertically with LayerHeader bars.

### Layout Switching

`LayoutSelector.vue` uses spatial proximity mapping (normalized coordinates, greedy 1:1 assignment) to preserve key bindings when switching between layouts with different key counts/topologies. Threshold: 0.08 squared normalized distance.

### Export Pipeline (`src/composables/useExport.ts`)

SVG/PNG/PDF all start from the same prepared SVG. PNG uses native Canvas API (SVG serialized to blob, drawn onto `<canvas>` via `drawImage`, exported via `toBlob`). PDF uses `jspdf` + `svg2pdf.js` for vector output.

### Component Organization

- `components/layout/` — App shell: header, toolbar, workspace, side panel
- `components/canvas/` — Canvas container, zoom/pan controls, render mode switching, KeyboardRenderer
- `components/keyboard/` — SVG rendering: KeyboardSvg, KeyCap, LayerHeader
- `components/editor/` — Layer panel, layer item (with reorder controls), key binding editor, layer binding editor
- `components/dialogs/` — Modals: export, theme picker, layout picker
- `components/ui/` — BaseModal

### Composables (`src/composables/`)

- `useExport.ts` — Export pipeline (SVG/PNG/PDF)
- `useKeyRenderer.ts` — Legend placement computation for key caps

### Utilities (`src/utils/`)

- `coordinates.ts` — ViewBox bounds and coordinate math
- `defaults.ts` — Factory functions for empty bindings, layers, keymaps, and projects
- `download.ts` — Blob/text download helpers
- `id.ts` — ID generation (counter + random)

### Key Shortcuts (App.vue)

Escape closes dialogs/deselects, Cmd+S saves JSON, Cmd+E opens export, Cmd+±/0 for zoom.
