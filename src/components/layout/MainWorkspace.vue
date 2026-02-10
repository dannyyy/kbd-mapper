<script setup lang="ts">
import KeyboardCanvas from '../canvas/KeyboardCanvas.vue'
import SidePanel from './SidePanel.vue'
</script>

<template>
  <main class="main-workspace">
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
</style>
