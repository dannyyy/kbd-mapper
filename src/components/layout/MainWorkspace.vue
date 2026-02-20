<script setup lang="ts">
import { useMobile } from '../../composables/useMobile'
import KeyboardCanvas from '../canvas/KeyboardCanvas.vue'
import SidePanel from './SidePanel.vue'

const { isMobileLandscape } = useMobile()
</script>

<template>
  <main class="main-workspace" :class="{ 'main-workspace--mobile': isMobileLandscape }">
    <KeyboardCanvas />
    <SidePanel />
  </main>
</template>

<style scoped>
.main-workspace {
  display: flex;
  gap: 16px;
  flex: 1;
  min-height: 0;
}

.main-workspace--mobile {
  gap: 0;
  padding: 4px;
}
</style>
