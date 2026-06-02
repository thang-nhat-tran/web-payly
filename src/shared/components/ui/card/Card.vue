<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
withDefaults(defineProps<{ clickable?: boolean }>(), { clickable: false })
</script>

<template>
  <div class="card-shell" :class="{ 'card-shell--clickable': clickable }">
    <slot />
  </div>
</template>

<style scoped>
.card-shell {
  background-color: var(--color-bg-surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.card-shell--clickable {
  cursor: pointer;
  transition:
    transform 0.15s var(--ease-standard),
    box-shadow 0.15s var(--ease-standard);
}

.card-shell--clickable:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.card-shell--clickable:active {
  transform: scale(0.98);
}
</style>
