# Plan: Layer Visualization Optimization

## Summary of Changes

Three related improvements to compact-mode keycap rendering and layer management.

---

## Task 1: Suppress Redundant Shift Layer Mappings

**Problem:** In compact mode, the Shift layer shows labels like `Q` on keys where the base layer already shows `Q`. This is visual noise — only keys that differ when shifted (e.g., `'` → `"`, `,` → `<`) carry useful information.

**Approach:**
- In `computeLegendPlacements()` (`src/composables/useKeyRenderer.ts`), detect the Shift layer by name (`layer.name.toLowerCase() === 'shift'`).
- When placing the Shift layer's legend, compare `shiftBinding.label.toLowerCase()` to `baseBinding.label.toLowerCase()`.
- If they match (case-insensitive), skip the placement entirely — treat it as if the binding were transparent.
- Only show the Shift legend when the labels genuinely differ (e.g., `"`, `<`, `>`, `?`).

**Files:** `src/composables/useKeyRenderer.ts`

---

## Task 2: Reorder Legend Positions (Shift Top-Center, Corners Clockwise)

**Problem:** Current corner layout is L1=top-left, L2=bottom-left, L3=bottom-right, L4=top-right (not clockwise). The Shift layer occupies a corner position like any other layer.

**New layout:**
```
+-------------------------------+
| [L1]      Shift-diff   [L2]  |  top-left / top-center / top-right
|                               |
|          Base (large)         |  center
|                               |
| [L4]                   [L3]  |  bottom-left / bottom-right
+-------------------------------+
```

**Changes:**
1. The Shift layer gets a dedicated **top-center** position (same area as hold labels), not a corner slot.
2. Remaining non-shift layers fill corners **clockwise**: top-left → top-right → bottom-right → bottom-left.
3. This means 4 corner slots remain for non-base/non-shift layers (same as before — shift just moved from a corner to top-center).

**Conflict with hold labels:** Mod-tap/layer-tap keys already use top-center for their hold label (e.g., "L2"). In the default Corne layout, these thumb keys have `trans()` on the Shift layer, so no conflict arises in practice. As a safeguard: if a key has both a hold label **and** a non-redundant shift label, the hold label takes priority and the shift label is skipped for that key.

**Files:** `src/composables/useKeyRenderer.ts`

---

## Task 3: Layer Reorder UI

**Problem:** The store already has `reorderLayer(fromIndex, toIndex)` but there's no UI to trigger it.

### Proposal: Up/Down Arrow Buttons

Add **▲ / ▼ arrow buttons** to each `LayerItem` in the sidebar layer list:

- Buttons appear on hover, next to the existing remove (×) button.
- **▲** moves the layer one position up (lower index); **▼** moves it one position down (higher index).
- The **Base layer (index 0)** shows no buttons — it's always pinned at position 0.
- The first non-base layer hides the ▲ button; the last layer hides the ▼ button.
- Reordering calls `projectStore.reorderLayer(fromIndex, toIndex)`, which splices the `layers` array. Since `computeLegendPlacements` reads layers in array order, the corner positions automatically reflect the new order.

**Why buttons over drag-and-drop:**
- No external library needed (the project has zero drag-drop dependencies).
- Works well for the typical 4-6 layer count.
- More accessible (keyboard-friendly).
- Drag-and-drop could be added later as an enhancement if desired.

**Files:**
- `src/components/editor/LayerItem.vue` — add ▲/▼ buttons and emit `move-up`/`move-down` events
- `src/components/editor/LayerPanel.vue` — wire up events to `projectStore.reorderLayer()`

---

## Implementation Order

1. Task 2 first (reorder corner positions) — changes the legend layout foundation
2. Task 1 (shift suppression) — builds on the new shift detection added in Task 2
3. Task 3 (reorder UI) — independent of rendering changes, done last

## Verification

Run `pnpm vue-tsc -b` after all changes to verify type-checking passes. No test framework is configured.
