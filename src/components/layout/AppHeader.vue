<script setup lang="ts">
import { useThemeStore } from '../../stores/theme'
import { useEditorStore } from '../../stores/editor'

const themeStore = useThemeStore()
const editorStore = useEditorStore()
</script>

<template>
  <header class="app-header">
    <div class="header-left">
      <span class="logo">⌨</span>
      <h1 class="app-title">Keyboard Show Off</h1>
    </div>

    <div class="header-right">
      <button
        class="header-btn"
        @click="editorStore.showThemeSelector = true"
        :title="`Theme: ${themeStore.currentTheme.name}`"
      >
        <span class="theme-preview" :style="{ backgroundColor: themeStore.currentTheme.colors.background, borderColor: themeStore.currentTheme.colors.keyDefault.stroke }" />
        {{ themeStore.currentTheme.name }}
      </button>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  background: var(--surface, #fff);
  border-bottom: 1px solid var(--border, #e5e7eb);
  flex-shrink: 0;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo {
  font-size: 22px;
}

.app-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--text-primary, #1f2937);
  margin: 0;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.header-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border: 1px solid var(--border, #d1d5db);
  background: var(--surface, #fff);
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  color: var(--text-primary, #1f2937);
  transition: background 0.15s;
}

.header-btn:hover {
  background: var(--hover, #f3f4f6);
}

.theme-preview {
  width: 14px;
  height: 14px;
  border-radius: 3px;
  border: 1.5px solid;
}
</style>
