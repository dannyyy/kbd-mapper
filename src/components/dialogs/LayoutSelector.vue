<script setup lang="ts">
import { useEditorStore } from '../../stores/editor'
import { useProjectStore } from '../../stores/project'
import { builtinLayouts } from '../../data/layouts'
import type { KeyPosition } from '../../types/layout'
import type { KeyBinding } from '../../types/keymap'
import BaseModal from '../ui/BaseModal.vue'

const editorStore = useEditorStore()
const projectStore = useProjectStore()

function keyCenter(k: KeyPosition): [number, number] {
  return [k.x + (k.w ?? 1) / 2, k.y + (k.h ?? 1) / 2]
}

function layoutBounds(keys: KeyPosition[]) {
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity
  for (const k of keys) {
    const cx = k.x + (k.w ?? 1) / 2
    const cy = k.y + (k.h ?? 1) / 2
    minX = Math.min(minX, cx)
    maxX = Math.max(maxX, cx)
    minY = Math.min(minY, cy)
    maxY = Math.max(maxY, cy)
  }
  return { minX, maxX, minY, maxY }
}

function normalizedCenters(keys: KeyPosition[]): [number, number][] {
  const b = layoutBounds(keys)
  const w = Math.max(b.maxX - b.minX, 0.001)
  const h = Math.max(b.maxY - b.minY, 0.001)
  return keys.map(k => {
    const [cx, cy] = keyCenter(k)
    return [(cx - b.minX) / w, (cy - b.minY) / h]
  })
}

function buildSpatialMapping(oldKeys: KeyPosition[], newKeys: KeyPosition[]): number[] {
  const oldNorm = normalizedCenters(oldKeys)
  const newNorm = normalizedCenters(newKeys)

  const mapping: number[] = new Array(newKeys.length).fill(-1)

  // Build candidate pairs sorted by distance
  const pairs: { newIdx: number; oldIdx: number; dist: number }[] = []
  for (let ni = 0; ni < newNorm.length; ni++) {
    for (let oi = 0; oi < oldNorm.length; oi++) {
      const dx = newNorm[ni]![0] - oldNorm[oi]![0]
      const dy = newNorm[ni]![1] - oldNorm[oi]![1]
      pairs.push({ newIdx: ni, oldIdx: oi, dist: dx * dx + dy * dy })
    }
  }
  pairs.sort((a, b) => a.dist - b.dist)

  // Greedy 1:1 assignment - closest pairs first
  const assignedNew = new Set<number>()
  const usedOld = new Set<number>()
  for (const p of pairs) {
    if (assignedNew.has(p.newIdx) || usedOld.has(p.oldIdx)) continue
    if (p.dist > 0.08) continue // ~28% of layout extent
    mapping[p.newIdx] = p.oldIdx
    assignedNew.add(p.newIdx)
    usedOld.add(p.oldIdx)
  }

  return mapping
}

function selectLayout(layoutId: string) {
  const newLayout = builtinLayouts.find(l => l.id === layoutId)
  if (!newLayout) return

  const oldLayout = projectStore.project.layout
  const mapping = buildSpatialMapping(oldLayout.keys, newLayout.keys)

  // Clone to prevent pinia-persist hydration from mutating the builtin object
  projectStore.project.layout = {
    ...newLayout,
    keys: newLayout.keys.map(k => ({ ...k })),
    splits: newLayout.splits ? [...newLayout.splits] : undefined,
    metadata: { ...newLayout.metadata, tags: newLayout.metadata.tags ? [...newLayout.metadata.tags] : undefined },
  }

  for (let li = 0; li < projectStore.layers.length; li++) {
    const oldBindings = [...projectStore.layers[li]!.bindings]
    const isBase = li === 0
    const emptyBinding: KeyBinding = isBase
      ? { label: '', type: 'normal' }
      : { label: '▽', type: 'transparent' }

    const newBindings: KeyBinding[] = new Array(newLayout.keys.length)
    for (let ki = 0; ki < newLayout.keys.length; ki++) {
      const oldIdx = mapping[ki]!
      newBindings[ki] = oldIdx >= 0 && oldIdx < oldBindings.length
        ? { ...oldBindings[oldIdx]! }
        : { ...emptyBinding }
    }
    projectStore.layers[li]!.bindings = newBindings
  }

  editorStore.clearSelection()
  editorStore.showLayoutSelector = false
}
</script>

<template>
  <BaseModal
    title="Choose Layout"
    :show="editorStore.showLayoutSelector"
    @close="editorStore.showLayoutSelector = false"
  >
    <div class="layout-grid">
      <button
        v-for="layout in builtinLayouts"
        :key="layout.id"
        class="layout-card"
        :class="{ active: projectStore.layout.id === layout.id }"
        @click="selectLayout(layout.id)"
      >
        <span class="layout-name">{{ layout.name }}</span>
        <span class="layout-info">{{ layout.keys.length }} keys</span>
        <div v-if="layout.metadata.tags" class="layout-tags">
          <span v-for="tag in layout.metadata.tags" :key="tag" class="tag">{{ tag }}</span>
        </div>
      </button>
    </div>
  </BaseModal>
</template>

<style scoped>
.layout-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 12px;
}

.layout-card {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 14px;
  border: 2px solid var(--border, #e5e7eb);
  background: var(--surface, #fff);
  border-radius: 8px;
  cursor: pointer;
  text-align: left;
  transition: border-color 0.15s, box-shadow 0.15s;
}

.layout-card:hover {
  border-color: var(--primary, #3b82f6);
}

.layout-card.active {
  border-color: var(--primary, #3b82f6);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
}

.layout-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary, #1f2937);
}

.layout-info {
  font-size: 12px;
  color: var(--text-secondary, #6b7280);
}

.layout-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 4px;
}

.tag {
  font-size: 10px;
  padding: 2px 6px;
  background: var(--surface-secondary, #f3f4f6);
  color: var(--text-secondary, #6b7280);
  border-radius: 3px;
}
</style>
