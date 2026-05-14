<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="skeleton" :style="{ width, height, borderRadius }" v-bind="$attrs" />
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    width?: string
    height?: string
    borderRadius?: string
  }>(),
  {
    width: '100%',
    height: '1.6rem',
    borderRadius: 'var(--radius-sm)',
  },
)
</script>

<style scoped>
.skeleton {
  background: linear-gradient(
    90deg,
    var(--color-dust) 25%,
    var(--color-surface-soft) 50%,
    var(--color-dust) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.6s ease-in-out infinite;
  flex-shrink: 0;
}

@keyframes shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>
