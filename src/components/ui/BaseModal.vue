<script setup lang="ts">
defineProps<{
  title: string
  show: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

function handleOverlayClick(e: MouseEvent) {
  if (e.target === e.currentTarget) {
    emit('close')
  }
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="show" class="modal-overlay" @click="handleOverlayClick">
        <div class="modal-container">
          <div class="modal-header">
            <h2 class="modal-title">{{ title }}</h2>
            <button class="modal-close" @click="emit('close')">&times;</button>
          </div>
          <div class="modal-body">
            <slot />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  backdrop-filter: blur(2px);
}

.modal-container {
  background: var(--surface, #fff);
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  min-width: min(400px, 92vw);
  max-width: 90vw;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

@media (pointer: coarse) and (max-height: 500px) {
  .modal-container {
    max-height: 90vh;
    border-radius: 8px;
  }

  .modal-header {
    padding: 10px 14px;
  }

  .modal-body {
    padding: 14px;
  }
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border, #e5e7eb);
}

.modal-title {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
  color: var(--text-primary, #1f2937);
}

.modal-close {
  border: none;
  background: none;
  font-size: 22px;
  cursor: pointer;
  color: var(--text-secondary, #9ca3af);
  padding: 0 4px;
  line-height: 1;
}

.modal-close:hover {
  color: var(--text-primary, #1f2937);
}

.modal-body {
  padding: 20px;
  overflow-y: auto;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-active .modal-container,
.modal-leave-active .modal-container {
  transition: transform 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-container {
  transform: scale(0.95) translateY(10px);
}

.modal-leave-to .modal-container {
  transform: scale(0.95) translateY(10px);
}
</style>
