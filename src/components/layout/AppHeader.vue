<script setup lang="ts">
import { useThemeStore } from '../../stores/theme'
import { useEditorStore } from '../../stores/editor'
import { useProjectStore } from '../../stores/project'
import { useMobile } from '../../composables/useMobile'
import { downloadText } from '../../utils/download'

const themeStore = useThemeStore()
const editorStore = useEditorStore()
const projectStore = useProjectStore()
const { isMobileLandscape } = useMobile()

function handleSave() {
  const json = projectStore.getProjectJson()
  downloadText(json, `${projectStore.project.name}.json`, 'application/json')
  projectStore.markKeymapSaved()
}

function handleLoad() {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.json'
  input.onchange = async (e) => {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (!file) return
    try {
      const text = await file.text()
      const data = JSON.parse(text)
      projectStore.loadProject(data)
    } catch (err) {
      console.error('Failed to load project:', err)
      alert("Failed to load project file. Make sure it's a valid JSON file.")
    }
  }
  input.click()
}
</script>

<template>
  <!-- Desktop: separate header -->
  <header v-if="!isMobileLandscape" class="app-header">
    <div class="header-left">
      <span class="logo">⌨</span>
      <h1 class="app-title">Kbd Mapper</h1>
    </div>

    <div class="header-right">
      <button
        class="header-btn"
        @click="editorStore.showThemeSelector = true"
        :title="`Theme: ${themeStore.currentTheme.name}`"
      >
        <span
          class="theme-preview"
          :style="{
            backgroundColor: themeStore.currentTheme.colors.background,
            borderColor: themeStore.currentTheme.colors.keyDefault.stroke,
          }"
        />
        {{ themeStore.currentTheme.name }}
      </button>
    </div>
  </header>

  <!-- Mobile: merged compact bar -->
  <header v-else class="app-header app-header--mobile">
    <div class="header-left">
      <span class="logo logo--mobile">⌨</span>
    </div>

    <div class="mobile-toolbar">
      <button class="mobile-btn" @click="projectStore.resetProject" title="New project">New</button>
      <button class="mobile-btn" @click="handleSave" title="Save project">Save</button>
      <button class="mobile-btn" @click="handleLoad" title="Load project">Load</button>
      <div class="separator" />
      <button
        class="mobile-btn"
        @click="editorStore.showLayoutSelector = true"
        title="Change layout"
      >
        {{ projectStore.layout.name }}
      </button>
      <div class="separator" />
      <button
        class="mobile-btn mobile-btn--primary"
        @click="editorStore.showExportDialog = true"
        title="Export image"
      >
        Export
      </button>
    </div>

    <div class="header-right">
      <button class="mobile-icon-btn" @click="editorStore.showThemeSelector = true" title="Theme">
        <span
          class="theme-preview"
          :style="{
            backgroundColor: themeStore.currentTheme.colors.background,
            borderColor: themeStore.currentTheme.colors.keyDefault.stroke,
          }"
        />
      </button>
      <button
        class="mobile-icon-btn hamburger-btn"
        @click="editorStore.toggleSidebar()"
        title="Toggle panel"
      >
        ☰
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

.app-header--mobile {
  padding: 6px 12px;
  gap: 8px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo {
  font-size: 22px;
}

.logo--mobile {
  font-size: 18px;
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

/* Mobile toolbar buttons merged into header */
.mobile-toolbar {
  display: flex;
  align-items: center;
  gap: 4px;
  flex: 1;
  justify-content: center;
}

.mobile-btn {
  padding: 6px 10px;
  border: 1px solid var(--border, #d1d5db);
  background: var(--surface, #fff);
  border-radius: 5px;
  cursor: pointer;
  font-size: 11px;
  font-weight: 500;
  color: var(--text-primary, #374151);
  transition: background 0.15s;
  min-height: 32px;
}

.mobile-btn:hover {
  background: var(--hover, #f3f4f6);
}

.mobile-btn--primary {
  background: var(--primary, #3b82f6);
  color: #fff;
  border-color: var(--primary, #3b82f6);
}

.mobile-btn--primary:hover {
  background: var(--primary-hover, #2563eb);
}

.mobile-icon-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 32px;
  border: 1px solid var(--border, #d1d5db);
  background: var(--surface, #fff);
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  color: var(--text-primary, #374151);
  transition: background 0.15s;
}

.mobile-icon-btn:hover {
  background: var(--hover, #f3f4f6);
}

.hamburger-btn {
  font-size: 18px;
}

.separator {
  width: 1px;
  height: 18px;
  background: var(--border, #e5e7eb);
  margin: 0 2px;
}
</style>
