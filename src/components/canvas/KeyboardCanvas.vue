<script setup lang="ts">
import { ref, computed, provide, onMounted } from 'vue'
import { useEditorStore } from '../../stores/editor'
import { useThemeStore } from '../../stores/theme'
import { useMobile } from '../../composables/useMobile'
import KeyboardRenderer from './KeyboardRenderer.vue'
import CanvasControls from './CanvasControls.vue'

const editorStore = useEditorStore()
const themeStore = useThemeStore()
const { isMobileLandscape } = useMobile()

const isPanning = ref(false)
const panStart = ref({ x: 0, y: 0 })
const canvasEl = ref<HTMLElement | null>(null)

// Touch gesture state
const touchState = ref<{
  active: boolean
  startPan: { x: number; y: number }
  startZoom: number
  startDistance: number
  lastCenter: { x: number; y: number }
  mode: 'none' | 'pan' | 'pinch'
}>({
  active: false,
  startPan: { x: 0, y: 0 },
  startZoom: 1,
  startDistance: 0,
  lastCenter: { x: 0, y: 0 },
  mode: 'none',
})

const background = computed(() => themeStore.currentTheme.colors.background)

const canvasStyle = computed(() => ({
  transform: `scale(${editorStore.canvasZoom}) translate(${editorStore.canvasPan.x}px, ${editorStore.canvasPan.y}px)`,
  transformOrigin: 'center center',
}))

function handleWheel(e: WheelEvent) {
  if (e.ctrlKey || e.metaKey) {
    // Zoom
    const delta = e.deltaY > 0 ? 0.9 : 1.1
    editorStore.setZoom(editorStore.canvasZoom * delta)
  } else {
    // Pan — divide by zoom so pan speed stays consistent at any zoom level
    const zoom = editorStore.canvasZoom
    const dx = e.shiftKey ? -e.deltaY / zoom : -e.deltaX / zoom
    const dy = e.shiftKey ? 0 : -e.deltaY / zoom
    editorStore.setPan(editorStore.canvasPan.x + dx, editorStore.canvasPan.y + dy)
  }
}

function handleMouseDown(e: MouseEvent) {
  if (e.button === 1 || (e.button === 0 && e.shiftKey)) {
    isPanning.value = true
    panStart.value = {
      x: e.clientX - editorStore.canvasPan.x,
      y: e.clientY - editorStore.canvasPan.y,
    }
    e.preventDefault()
  }
}

function handleMouseMove(e: MouseEvent) {
  if (isPanning.value) {
    editorStore.setPan(e.clientX - panStart.value.x, e.clientY - panStart.value.y)
  }
}

function handleMouseUp() {
  isPanning.value = false
}

// --- Touch gesture handlers ---

function getTouchDistance(t1: Touch, t2: Touch): number {
  const dx = t1.clientX - t2.clientX
  const dy = t1.clientY - t2.clientY
  return Math.sqrt(dx * dx + dy * dy)
}

function getTouchCenter(t1: Touch, t2: Touch): { x: number; y: number } {
  return {
    x: (t1.clientX + t2.clientX) / 2,
    y: (t1.clientY + t2.clientY) / 2,
  }
}

function handleTouchStart(e: TouchEvent) {
  if (e.touches.length === 1) {
    // Single finger: pan
    const touch = e.touches[0]!
    touchState.value = {
      active: true,
      startPan: {
        x: touch.clientX - editorStore.canvasPan.x * editorStore.canvasZoom,
        y: touch.clientY - editorStore.canvasPan.y * editorStore.canvasZoom,
      },
      startZoom: editorStore.canvasZoom,
      startDistance: 0,
      lastCenter: { x: touch.clientX, y: touch.clientY },
      mode: 'pan',
    }
  } else if (e.touches.length === 2) {
    // Two fingers: pinch-to-zoom
    const t1 = e.touches[0]!
    const t2 = e.touches[1]!
    const distance = getTouchDistance(t1, t2)
    const center = getTouchCenter(t1, t2)
    touchState.value = {
      active: true,
      startPan: { x: editorStore.canvasPan.x, y: editorStore.canvasPan.y },
      startZoom: editorStore.canvasZoom,
      startDistance: distance,
      lastCenter: center,
      mode: 'pinch',
    }
  }
}

function handleTouchMove(e: TouchEvent) {
  if (!touchState.value.active) return

  if (touchState.value.mode === 'pan' && e.touches.length === 1) {
    const touch = e.touches[0]!
    const zoom = editorStore.canvasZoom
    editorStore.setPan(
      (touch.clientX - touchState.value.startPan.x) / zoom,
      (touch.clientY - touchState.value.startPan.y) / zoom,
    )
  } else if (touchState.value.mode === 'pinch' && e.touches.length === 2) {
    const t1 = e.touches[0]!
    const t2 = e.touches[1]!
    const distance = getTouchDistance(t1, t2)
    const scale = distance / touchState.value.startDistance
    editorStore.setZoom(touchState.value.startZoom * scale)
  }
}

function handleTouchEnd(e: TouchEvent) {
  if (e.touches.length === 0) {
    touchState.value.active = false
    touchState.value.mode = 'none'
  } else if (e.touches.length === 1 && touchState.value.mode === 'pinch') {
    // Went from 2 fingers to 1: switch to pan
    const touch = e.touches[0]!
    touchState.value = {
      active: true,
      startPan: {
        x: touch.clientX - editorStore.canvasPan.x * editorStore.canvasZoom,
        y: touch.clientY - editorStore.canvasPan.y * editorStore.canvasZoom,
      },
      startZoom: editorStore.canvasZoom,
      startDistance: 0,
      lastCenter: { x: touch.clientX, y: touch.clientY },
      mode: 'pan',
    }
  }
}

function fitToView() {
  const canvas = canvasEl.value
  if (!canvas) return
  const renderer = canvas.querySelector('.keyboard-renderer') as HTMLElement | null
  if (!renderer) return

  const canvasRect = canvas.getBoundingClientRect()
  // Temporarily reset transform to measure natural content size
  const viewport = canvas.querySelector('.canvas-viewport') as HTMLElement | null
  if (!viewport) return
  const prevTransform = viewport.style.transform
  const prevTransition = viewport.style.transition
  viewport.style.transition = 'none'
  viewport.style.transform = 'scale(1) translate(0px, 0px)'
  const contentRect = renderer.getBoundingClientRect()
  viewport.style.transform = prevTransform
  viewport.style.transition = prevTransition

  if (contentRect.width === 0 || contentRect.height === 0) return

  const padding = isMobileLandscape.value ? 16 : 48
  const availW = canvasRect.width - padding * 2
  const availH = canvasRect.height - padding * 2
  const zoom = Math.min(availW / contentRect.width, availH / contentRect.height, 2)

  editorStore.setZoom(zoom)
  editorStore.setPan(0, 0)
}

provide('fitToView', fitToView)

// Auto fit-to-view on mobile
onMounted(() => {
  if (isMobileLandscape.value) {
    // Delay to ensure layout is painted
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        fitToView()
      })
    })
  }
})
</script>

<template>
  <div
    ref="canvasEl"
    class="keyboard-canvas"
    :class="{ 'keyboard-canvas--mobile': isMobileLandscape }"
    :style="{ backgroundColor: background }"
    @wheel.prevent="handleWheel"
    @mousedown="handleMouseDown"
    @mousemove="handleMouseMove"
    @mouseup="handleMouseUp"
    @mouseleave="handleMouseUp"
    @touchstart.prevent="handleTouchStart"
    @touchmove.prevent="handleTouchMove"
    @touchend="handleTouchEnd"
    @touchcancel="handleTouchEnd"
  >
    <div class="canvas-viewport" :style="canvasStyle">
      <KeyboardRenderer />
    </div>
    <div class="canvas-controls-wrapper">
      <CanvasControls />
    </div>
  </div>
</template>

<style scoped>
.keyboard-canvas {
  position: relative;
  flex: 1;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  border-radius: 12px;
  border: 1px solid var(--border, #e5e7eb);
  touch-action: none;
}

.keyboard-canvas--mobile {
  min-height: 0;
  border-radius: 6px;
}

.canvas-viewport {
  padding: 32px;
}

.keyboard-canvas--mobile .canvas-viewport {
  padding: 12px;
}

.canvas-controls-wrapper {
  position: absolute;
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
}

.keyboard-canvas--mobile .canvas-controls-wrapper {
  bottom: 6px;
}
</style>
