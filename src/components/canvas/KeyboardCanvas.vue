<script setup lang="ts">
import { ref, computed } from 'vue'
import { useEditorStore } from '../../stores/editor'
import { useThemeStore } from '../../stores/theme'
import KeyboardRenderer from './KeyboardRenderer.vue'
import CanvasControls from './CanvasControls.vue'

const editorStore = useEditorStore()
const themeStore = useThemeStore()

const canvasRef = ref<HTMLElement>()
const isPanning = ref(false)
const panStart = ref({ x: 0, y: 0 })

const background = computed(() => themeStore.currentTheme.colors.background)

const canvasStyle = computed(() => ({
  transform: `scale(${editorStore.canvasZoom}) translate(${editorStore.canvasPan.x}px, ${editorStore.canvasPan.y}px)`,
  transformOrigin: 'center center',
}))

function handleWheel(e: WheelEvent) {
  if (e.ctrlKey || e.metaKey) {
    e.preventDefault()
    const delta = e.deltaY > 0 ? 0.9 : 1.1
    editorStore.setZoom(editorStore.canvasZoom * delta)
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
    editorStore.setPan(
      e.clientX - panStart.value.x,
      e.clientY - panStart.value.y,
    )
  }
}

function handleMouseUp() {
  isPanning.value = false
}
</script>

<template>
  <div
    ref="canvasRef"
    class="keyboard-canvas"
    :style="{ backgroundColor: background }"
    @wheel="handleWheel"
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
  transition: transform 0.1s ease-out;
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
