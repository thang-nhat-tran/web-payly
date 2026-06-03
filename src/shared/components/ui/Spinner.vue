<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
withDefaults(
  defineProps<{
    /** Diameter of the spinner (any CSS length, e.g. '2.4rem'). */
    size?: string
  }>(),
  { size: '2.4rem' },
)
</script>

<template>
  <span class="spinner" :style="{ fontSize: size }" role="status" aria-label="Loading" v-bind="$attrs" />
</template>

<style scoped>
.spinner {
  display: inline-block;
  width: 1em;
  height: 1em;
  border: 0.14em solid currentColor;
  border-right-color: transparent;
  border-radius: var(--radius-round);
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
