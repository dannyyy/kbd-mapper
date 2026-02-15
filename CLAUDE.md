# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev           # Start Vite dev server (default port 5173)
pnpm build         # Type-check (vue-tsc) then build for production
pnpm vue-tsc -b    # Type-check only (no lint/test tooling configured)
```

No test framework, linter, or formatter is configured.

## Architecture

Browser-based keyboard layout visualizer and editor for custom keyboard enthusiasts. Renders multi-layer keymaps as SVG with theme support and exports to SVG/PNG/PDF. Fully client-side, no backend.

**Stack:** Vue 3 (Composition API, `<script setup>`) + TypeScript + Vite + Pinia

### Data Model

The core domain has four types (in `src/types/`):

- **PhysicalLayout** — Key positions in QMK-compatible units (x, y, w, h, rotation). 8 builtin layouts in `src/data/layouts/`.
- **Keymap** — Named collection of Layers. Each Layer has an array of KeyBindings (one per physical key position, same index).
- **KeyBinding** — Label + KeyType (normal, modifier, layer-toggle, layer-tap, mod-tap, transparent, none, media, navigation, function, custom). Dual-role keys have holdLabel/holdType.
- **Theme** — Colors, typography, layout spacing. Drives SVG inline attributes (not CSS) so exports match the editor exactly. 5 builtin themes in `src/data/themes/`.

These are composed into a **Project** (`src/types/project.ts`) which is the unit of persistence.

### State Management (Pinia)

Three stores in `src/stores/`:

- **project** — The Project state (layout + keymap + settings). Persisted to localStorage via `pinia-plugin-persistedstate`. Contains all layer/key CRUD actions.
- **editor** — UI-only state: selection, zoom/pan, dialog visibility, sidebar tab. Not persisted.
- **theme** — Current theme ID + user-created themes. Persisted separately.

**Critical pattern:** Builtin layout/theme objects from `src/data/` must never be directly assigned to the reactive store. Always deep-clone first, because pinia-persist hydration mutates objects in-place.

### Rendering Pipeline

All rendering is SVG via Vue templates (no canvas/D3):

1. **KeyboardRenderer** decides compact vs expanded mode based on visible layer count (<=5 = compact).
2. **KeyboardSvg** computes viewBox bounds using `src/utils/coordinates.ts`, iterates keys.
3. **KeyCap** renders each key: `<rect>` background styled by theme + key type, `<text>` legends positioned by `useKeyRenderer.computeLegendPlacements()`.

**Compact mode legend layout:** Base layer center (large), hold label top-center (small), layers 1-4 in corners with colored indicators.

**Expanded mode:** One full keyboard per layer, stacked vertically with LayerHeader bars.

### Layout Switching

`LayoutSelector.vue` uses spatial proximity mapping (normalized coordinates, greedy 1:1 assignment) to preserve key bindings when switching between layouts with different key counts/topologies. Threshold: 0.08 squared normalized distance.

### Export Pipeline (`src/composables/useExport.ts`)

SVG/PNG/PDF all start from the same prepared SVG. PNG uses `html-to-image`, PDF uses `jspdf` + `svg2pdf.js` for vector output.

### Component Organization

- `components/layout/` — App shell: header, toolbar, workspace, sidebar
- `components/canvas/` — Canvas container, zoom/pan controls, render mode switching
- `components/keyboard/` — SVG rendering: KeyboardSvg, KeyCap, LayerHeader
- `components/editor/` — Layer list, key binding editor
- `components/dialogs/` — Modals: export, theme picker, layout picker
- `components/ui/` — BaseModal

### Key Shortcuts (App.vue)

Escape closes dialogs/deselects, Cmd+S saves JSON, Cmd+E opens export, Cmd+±/0 for zoom.
