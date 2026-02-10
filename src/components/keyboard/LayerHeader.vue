<script setup lang="ts">
defineProps<{
  name: string
  color: string
  fontFamily: string
}>()
</script>

<template>
  <div class="layer-header" :style="{ borderLeftColor: color }">
    <span class="layer-dot" :style="{ backgroundColor: color }" />
    <span class="layer-name" :style="{ fontFamily }">{{ name }}</span>
  </div>
</template>

<style scoped>
.layer-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-left: 4px solid;
  margin-bottom: 4px;
}

.layer-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.layer-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary, #1f2937);
}
</style>
