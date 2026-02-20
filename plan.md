# Mobile Landscape Optimization Plan

## Feasibility Assessment

**Verdict: Yes, this is worthwhile and feasible.**

The app's SVG-based rendering is inherently resolution-independent, and the flex-based layout is a solid foundation. The main barriers are: no touch handling, a fixed-width sidebar, and too much vertical chrome. All are fixable without a rewrite.

**Target devices:** 6"+ smartphones in landscape (iPhone Pro/Pro Max, Galaxy S2x+, Pixel Pro). These give roughly **850–930 × 390–430 CSS pixels** in landscape.

**Scope:** Landscape-only is a sensible constraint. The keyboard visualizer needs horizontal space, and portrait on a phone is simply too narrow to be useful.

---

## Current Problems on Mobile

| Issue                                                                     | Impact                                                          |
| ------------------------------------------------------------------------- | --------------------------------------------------------------- |
| **No touch events** — canvas only handles `mousedown/move/up` and `wheel` | Cannot pan or zoom on touch devices at all                      |
| **Side panel is fixed 260px** — never collapses                           | Steals 30% of horizontal space, leaving ~600px for the keyboard |
| **Header (48px) + Toolbar (38px) = ~86px vertical overhead**              | On a 400px-tall viewport, that's 22% wasted on chrome           |
| **Canvas min-height: 400px**                                              | Taller than some phone viewports entirely                       |
| **Modal min-width: 400px**                                                | Wider than some phone viewports                                 |
| **Toolbar buttons have small touch targets** (5px vertical padding)       | Hard to tap accurately                                          |
| **KeyCap only emits on `click`**                                          | Works via touch, but no feedback/affordance                     |
| **No viewport lock to landscape**                                         | No guidance to rotate the device                                |

---

## Proposed Changes

### 1. Detect Mobile & Lock Landscape Orientation

- Add a `useMobile` composable that exposes a reactive `isMobile` boolean (based on `matchMedia` for viewport width/touch capability and pointer type).
- Add a CSS `@media screen and (orientation: portrait)` overlay prompting users to rotate their device when viewport is narrow. This avoids fighting the browser's orientation API.
- Add `isMobileLandscape` computed for the specific breakpoint we optimize for (e.g., `max-height: 500px AND pointer: coarse`).

### 2. Compact App Chrome (Header + Toolbar)

Merge header and toolbar into a **single 44px bar** on mobile landscape:

```
┌──────────────────────────────────────────────────────────┐
│ ⌨ Kbd Mapper  │ New Save Load │ Iris SE ▾ │ Export │ ☰  │
└──────────────────────────────────────────────────────────┘
```

- The `☰` hamburger button opens the side panel as a drawer.
- Theme button moves into the drawer or a "more" overflow menu.
- This saves ~40px of vertical space (huge on a 400px screen).

### 3. Side Panel → Slide-Out Drawer

On mobile landscape, the side panel becomes a **right-edge slide-out drawer** overlaying the canvas:

- Triggered by the `☰` button or by tapping a key (auto-opens "Key" tab).
- Full height of the workspace area, ~280px wide.
- Semi-transparent backdrop that dismisses on tap.
- The drawer closes automatically after editing a key binding (tap another key to reopen).
- This gives the canvas **100% of the horizontal space** when not editing.

### 4. Touch Gesture Support on Canvas

Add touch event handlers to `KeyboardCanvas.vue`:

- **Single-finger drag** → pan (replacing shift+mousedown)
- **Two-finger pinch** → zoom (replacing ctrl+wheel)
- **Single tap on key** → select key (already works via click, but ensure no 300ms delay by using `touch-action: manipulation`)
- **Tap on empty canvas** → deselect / close drawer
- Use `touch-action: none` on the canvas to prevent browser scroll/zoom interference.

Implementation: Add `touchstart`, `touchmove`, `touchend` handlers alongside existing mouse handlers. Track touch count to distinguish pan vs. pinch.

### 5. Fix Hardcoded Sizes

| Component        | Current             | Mobile Fix                                   |
| ---------------- | ------------------- | -------------------------------------------- |
| `KeyboardCanvas` | `min-height: 400px` | `min-height: 200px` on mobile                |
| `BaseModal`      | `min-width: 400px`  | `min-width: min(400px, 92vw)`                |
| Canvas viewport  | `padding: 32px`     | `padding: 12px` on mobile                    |
| Canvas controls  | `bottom: 12px`      | `bottom: 8px`, slightly larger touch targets |
| Toolbar buttons  | `padding: 5px 12px` | `min-height: 36px` (touch-friendly)          |

### 6. Auto Fit-to-View on Load

Call `fitToView()` automatically when the layout loads on mobile, so the keyboard fills the available canvas without manual zooming.

### 7. Responsive Modals

- Modals on mobile: full-width (`width: 92vw`), remove `min-width: 400px`.
- Export dialog, theme selector, layout selector all get `max-height: 85vh` with internal scrolling.
- Increase touch targets in modal buttons to min 44px height.

### 8. CSS Breakpoint Strategy

Use a single, clearly-defined breakpoint approach:

```css
/* Mobile landscape: coarse pointer + limited height */
@media (pointer: coarse) and (max-height: 500px) {
  /* mobile landscape optimizations */
}

/* Orientation prompt for narrow portrait screens */
@media (max-width: 600px) and (orientation: portrait) {
  /* show rotate prompt */
}
```

Using `pointer: coarse` ensures we don't affect desktop users who resize their windows small. The `max-height: 500px` targets landscape phones specifically.

---

## Files to Modify

| File                                       | Changes                                     |
| ------------------------------------------ | ------------------------------------------- |
| `src/composables/useMobile.ts`             | **New** — mobile detection composable       |
| `src/stores/editor.ts`                     | Add `sidebarOpen` state for drawer toggle   |
| `src/App.vue`                              | Conditional compact chrome, rotation prompt |
| `src/components/layout/AppHeader.vue`      | Merge with toolbar on mobile                |
| `src/components/layout/ProjectToolbar.vue` | Hide on mobile (merged into header)         |
| `src/components/layout/MainWorkspace.vue`  | Remove gap on mobile                        |
| `src/components/layout/SidePanel.vue`      | Drawer mode with overlay on mobile          |
| `src/components/canvas/KeyboardCanvas.vue` | Touch handlers, reduced min-height/padding  |
| `src/components/canvas/CanvasControls.vue` | Larger touch targets on mobile              |
| `src/components/ui/BaseModal.vue`          | Responsive min-width                        |
| `src/assets/styles/main.css`               | Global mobile overrides, rotation prompt    |

---

## What This Does NOT Include

- **Portrait mode support** — intentionally excluded; the keyboard simply doesn't fit.
- **Responsive typography / key label scaling** — SVG handles this naturally.
- **Mobile-specific key editor redesign** — the current form-based editor works fine in a drawer.
- **Offline/PWA support** — orthogonal concern.

---

## Summary

The core idea is: **on mobile landscape, collapse the chrome, make the sidebar a drawer, add touch gestures, and fix hardcoded sizes.** The keyboard SVG rendering needs zero changes — it's already resolution-independent. The effort is concentrated in the layout shell and canvas interaction layer.
