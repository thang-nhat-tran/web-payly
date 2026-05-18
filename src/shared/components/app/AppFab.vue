<script setup lang="ts">
import type { Component } from 'vue'

const props = defineProps<{
  icon: Component
}>()

defineEmits<{ click: [] }>()
</script>

<template>
  <button class="fab" v-bind="$attrs" @click="$emit('click')">
    <component :is="props.icon" :size="24" :stroke-width="2" />
  </button>
</template>

<style scoped>
.fab {
  position: fixed;
  bottom: var(--spacing-4);
  right: var(--spacing-4);
  width: 56px;
  height: 56px;
  border-radius: var(--radius-circle);
  background-color: var(--color-ink);
  color: var(--color-canvas);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-card);
  cursor: pointer;
  transition:
    transform 0.15s var(--ease-standard),
    opacity 0.15s var(--ease-standard);
}

.fab:hover {
  opacity: 0.88;
  transform: scale(1.06);
}

.fab:active {
  transform: scale(0.95);
}
</style>
