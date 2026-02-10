import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Project } from '../types/project'
import type { Layer, KeyBinding, KeyType } from '../types/keymap'
import { corne3x6 } from '../data/layouts'
import { corneQwertyBase, corneSymbolLayer, corneNumberLayer, corneNavLayer } from '../data/keycodes/basic'
import { generateId } from '../utils/id'
import { getLayerColor, createEmptyBinding } from '../utils/defaults'

function cloneLayout(layout: typeof corne3x6) {
  return {
    ...layout,
    keys: layout.keys.map(k => ({ ...k })),
    splits: layout.splits ? [...layout.splits] : undefined,
    metadata: { ...layout.metadata, tags: layout.metadata.tags ? [...layout.metadata.tags] : undefined },
  }
}

function createDefaultProject(): Project {
  return {
    id: generateId('project'),
    name: 'My Keyboard',
    layout: cloneLayout(corne3x6),
    keymap: {
      id: generateId('keymap'),
      name: 'Default Keymap',
      layers: [
        {
          id: generateId('layer'),
          name: 'Base',
          color: getLayerColor(0),
          bindings: corneQwertyBase,
          visible: true,
        },
        {
          id: generateId('layer'),
          name: 'Symbols',
          color: getLayerColor(1),
          bindings: corneSymbolLayer,
          visible: true,
        },
        {
          id: generateId('layer'),
          name: 'Numbers',
          color: getLayerColor(2),
          bindings: corneNumberLayer,
          visible: true,
        },
        {
          id: generateId('layer'),
          name: 'Nav',
          color: getLayerColor(3),
          bindings: corneNavLayer,
          visible: true,
        },
      ],
    },
    themeId: 'clean-light',
    settings: {
      renderMode: 'auto',
      showLayerColors: true,
    },
  }
}

export const useProjectStore = defineStore('project', () => {
  const project = ref<Project>(createDefaultProject())

  const layers = computed(() => project.value.keymap.layers)
  const visibleLayers = computed(() => layers.value.filter(l => l.visible))
  const layout = computed(() => project.value.layout)
  const keyCount = computed(() => project.value.layout.keys.length)

  const renderMode = computed<'compact' | 'expanded'>(() => {
    if (project.value.settings.renderMode !== 'auto') {
      return project.value.settings.renderMode
    }
    return visibleLayers.value.length <= 5 ? 'compact' : 'expanded'
  })

  // Layer CRUD
  function addLayer(name?: string) {
    const idx = layers.value.length
    const layer: Layer = {
      id: generateId('layer'),
      name: name ?? `Layer ${idx}`,
      color: getLayerColor(idx),
      bindings: Array.from({ length: keyCount.value }, () => createEmptyBinding()),
      visible: true,
    }
    project.value.keymap.layers.push(layer)
  }

  function removeLayer(layerId: string) {
    const idx = layers.value.findIndex(l => l.id === layerId)
    if (idx > 0) { // Never remove base layer
      project.value.keymap.layers.splice(idx, 1)
    }
  }

  function reorderLayer(fromIndex: number, toIndex: number) {
    if (fromIndex === 0 || toIndex === 0) return // Don't move base layer
    const [layer] = project.value.keymap.layers.splice(fromIndex, 1)
    project.value.keymap.layers.splice(toIndex, 0, layer)
  }

  function renameLayer(layerId: string, name: string) {
    const layer = layers.value.find(l => l.id === layerId)
    if (layer) layer.name = name
  }

  function setLayerColor(layerId: string, color: string) {
    const layer = layers.value.find(l => l.id === layerId)
    if (layer) layer.color = color
  }

  function toggleLayerVisibility(layerId: string) {
    const layer = layers.value.find(l => l.id === layerId)
    if (layer) layer.visible = !layer.visible
  }

  // Key binding editing
  function setKeyBinding(layerId: string, keyIndex: number, binding: KeyBinding) {
    const layer = layers.value.find(l => l.id === layerId)
    if (layer && keyIndex >= 0 && keyIndex < layer.bindings.length) {
      layer.bindings[keyIndex] = { ...binding }
    }
  }

  function setKeyLabel(layerId: string, keyIndex: number, label: string) {
    const layer = layers.value.find(l => l.id === layerId)
    if (layer && keyIndex >= 0 && keyIndex < layer.bindings.length) {
      layer.bindings[keyIndex].label = label
    }
  }

  function setKeyType(layerId: string, keyIndex: number, type: KeyType) {
    const layer = layers.value.find(l => l.id === layerId)
    if (layer && keyIndex >= 0 && keyIndex < layer.bindings.length) {
      layer.bindings[keyIndex].type = type
    }
  }

  function setKeyHold(layerId: string, keyIndex: number, holdLabel: string, holdType: KeyType) {
    const layer = layers.value.find(l => l.id === layerId)
    if (layer && keyIndex >= 0 && keyIndex < layer.bindings.length) {
      layer.bindings[keyIndex].holdLabel = holdLabel
      layer.bindings[keyIndex].holdType = holdType
    }
  }

  // Project management
  function setRenderMode(mode: 'compact' | 'expanded' | 'auto') {
    project.value.settings.renderMode = mode
  }

  function loadProject(data: Project) {
    project.value = data
  }

  function resetProject() {
    project.value = createDefaultProject()
  }

  function getProjectJson(): string {
    return JSON.stringify(project.value, null, 2)
  }

  return {
    project,
    layers,
    visibleLayers,
    layout,
    keyCount,
    renderMode,
    addLayer,
    removeLayer,
    reorderLayer,
    renameLayer,
    setLayerColor,
    toggleLayerVisibility,
    setKeyBinding,
    setKeyLabel,
    setKeyType,
    setKeyHold,
    setRenderMode,
    loadProject,
    resetProject,
    getProjectJson,
  }
}, {
  persist: {
    key: 'keyboard-show-off-project',
    pick: ['project'],
  },
})
