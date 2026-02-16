<script setup lang="ts">
import { useThemeStore } from '../../stores/theme'
import { useEditorStore } from '../../stores/editor'
import BaseModal from '../ui/BaseModal.vue'

const themeStore = useThemeStore()
const editorStore = useEditorStore()
</script>

<template>
  <BaseModal
    title="Choose Theme"
    :show="editorStore.showThemeSelector"
    @close="editorStore.showThemeSelector = false"
  >
    <div class="theme-grid">
      <button
        v-for="theme in themeStore.allThemes"
        :key="theme.id"
        class="theme-card"
        :class="{ active: themeStore.currentThemeId === theme.id }"
        @click="
          () => {
            themeStore.setTheme(theme.id)
            editorStore.showThemeSelector = false
          }
        "
      >
        <div class="theme-preview" :style="{ backgroundColor: theme.colors.background }">
          <div class="preview-keys">
            <div
              class="preview-key"
              :style="{
                backgroundColor: theme.colors.keyDefault.fill,
                borderColor: theme.colors.keyDefault.stroke,
                borderRadius: (theme.colors.keyDefault.borderRadius ?? 4) + 'px',
                color: theme.colors.keyDefault.textColor,
              }"
            >
              A
            </div>
            <div
              class="preview-key mod"
              :style="{
                backgroundColor:
                  theme.colors.keyStyles.modifier?.fill ?? theme.colors.keyDefault.fill,
                borderColor:
                  theme.colors.keyStyles.modifier?.stroke ?? theme.colors.keyDefault.stroke,
                borderRadius: (theme.colors.keyDefault.borderRadius ?? 4) + 'px',
                color:
                  theme.colors.keyStyles.modifier?.textColor ?? theme.colors.keyDefault.textColor,
              }"
            >
              Ctrl
            </div>
          </div>
        </div>
        <span class="theme-name">{{ theme.name }}</span>
        <span v-if="theme.source === 'user'" class="badge">Custom</span>
      </button>
    </div>
  </BaseModal>
</template>

<style scoped>
.theme-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 12px;
}

.theme-card {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 0;
  border: 2px solid var(--border, #e5e7eb);
  background: var(--surface, #fff);
  border-radius: 8px;
  cursor: pointer;
  overflow: hidden;
  transition:
    border-color 0.15s,
    box-shadow 0.15s;
}

.theme-card:hover {
  border-color: var(--primary, #3b82f6);
}

.theme-card.active {
  border-color: var(--primary, #3b82f6);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
}

.theme-preview {
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

.preview-keys {
  display: flex;
  gap: 4px;
}

.preview-key {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 600;
  border: 1.5px solid;
}

.preview-key.mod {
  font-size: 8px;
}

.theme-name {
  font-size: 13px;
  font-weight: 500;
  padding: 0 12px 10px;
  color: var(--text-primary, #1f2937);
  text-align: left;
}

.badge {
  font-size: 10px;
  background: var(--primary-light, #eff6ff);
  color: var(--primary, #3b82f6);
  padding: 2px 6px;
  border-radius: 3px;
  margin: 0 12px 10px;
  align-self: flex-start;
}
</style>
