<script setup lang="ts">
import { ref, computed, provide } from 'vue'
import { useEditorStore } from '../../stores/editor'
import { useThemeStore } from '../../stores/theme'
import KeyboardRenderer from './KeyboardRenderer.vue'
import CanvasControls from './CanvasControls.vue'

const editorStore = useEditorStore()
const themeStore = useThemeStore()

const isPanning = ref(false)
const panStart = ref({ x: 0, y: 0 })
const canvasEl = ref<HTMLElement | null>(null)

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
    editorStore.setPan(
      editorStore.canvasPan.x + dx,
      editorStore.canvasPan.y + dy,
    )
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

  const padding = 48
  const availW = canvasRect.width - padding * 2
  const availH = canvasRect.height - padding * 2
  const zoom = Math.min(availW / contentRect.width, availH / contentRect.height, 2)

  editorStore.setZoom(zoom)
  editorStore.setPan(0, 0)
}

provide('fitToView', fitToView)
</script>

<template>
  <div
    ref="canvasEl"
    class="keyboard-canvas"
    :style="{ backgroundColor: background }"
    @wheel.prevent="handleWheel"
    @mousedown="handleMouseDown"
    @mousemove="handleMouseMove"
    @mouseup="handleMouseUp"
    @mouseleave="handleMouseUp"
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
}

.canvas-viewport {
  padding: 32px;
}

.canvas-controls-wrapper {
  position: absolute;
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
}
</style>
