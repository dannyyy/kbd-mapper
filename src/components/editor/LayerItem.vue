<script setup lang="ts">
import { ref } from 'vue'
import type { Layer } from '../../types/keymap'

const props = defineProps<{
  layer: Layer
  index: number
  isActive: boolean
}>()

const emit = defineEmits<{
  activate: []
  toggleVisibility: []
  rename: [name: string]
  setColor: [color: string]
  remove: []
}>()

const isEditing = ref(false)
const editName = ref('')

function startEditing() {
  editName.value = props.layer.name
  isEditing.value = true
}

function finishEditing() {
  if (editName.value.trim()) {
    emit('rename', editName.value.trim())
  }
  isEditing.value = false
}
</script>

<template>
  <div
    class="layer-item"
    :class="{ active: isActive }"
    @click="emit('activate')"
  >
    <button
      class="visibility-btn"
      :class="{ hidden: !layer.visible }"
      @click.stop="emit('toggleVisibility')"
      :title="layer.visible ? 'Hide layer' : 'Show layer'"
    >
      {{ layer.visible ? '●' : '○' }}
    </button>

    <span class="layer-dot" :style="{ backgroundColor: layer.color }" />

    <template v-if="isEditing">
      <input
        v-model="editName"
        class="layer-name-input"
        @blur="finishEditing"
        @keydown.enter="finishEditing"
        @keydown.escape="isEditing = false"
        @click.stop
        ref="nameInput"
        autofocus
      />
    </template>
    <template v-else>
      <span class="layer-name" @dblclick.stop="startEditing">
        {{ layer.name }}
      </span>
    </template>

    <input
      type="color"
      :value="layer.color"
      class="color-input"
      @input="emit('setColor', ($event.target as HTMLInputElement).value)"
      @click.stop
      title="Layer color"
    />

    <button
      v-if="index > 0"
      class="remove-btn"
      @click.stop="emit('remove')"
      title="Remove layer"
    >×</button>
  </div>
</template>

<style scoped>
.layer-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.15s;
}

.layer-item:hover {
  background: var(--hover, #f3f4f6);
}

.layer-item.active {
  background: var(--active, #eff6ff);
  box-shadow: inset 0 0 0 1px var(--active-border, #bfdbfe);
}

.visibility-btn {
  border: none;
  background: none;
  cursor: pointer;
  font-size: 10px;
  padding: 2px;
  color: var(--text-secondary, #6b7280);
  width: 18px;
  text-align: center;
}

.visibility-btn.hidden {
  opacity: 0.4;
}

.layer-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.layer-name {
  flex: 1;
  font-size: 13px;
  font-weight: 500;
  color: var(--text-primary, #1f2937);
  user-select: none;
}

.layer-name-input {
  flex: 1;
  font-size: 13px;
  font-weight: 500;
  padding: 2px 4px;
  border: 1px solid var(--border, #d1d5db);
  border-radius: 3px;
  outline: none;
  background: var(--surface, #fff);
  color: var(--text-primary, #1f2937);
}

.color-input {
  width: 20px;
  height: 20px;
  border: none;
  padding: 0;
  cursor: pointer;
  background: none;
  border-radius: 4px;
}

.remove-btn {
  border: none;
  background: none;
  cursor: pointer;
  color: var(--text-secondary, #9ca3af);
  font-size: 16px;
  padding: 0 2px;
  line-height: 1;
  opacity: 0;
  transition: opacity 0.15s;
}

.layer-item:hover .remove-btn {
  opacity: 1;
}

.remove-btn:hover {
  color: var(--danger, #ef4444);
}
</style>
