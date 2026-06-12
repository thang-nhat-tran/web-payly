<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { useMergedAttrs } from '@/shared/composables/useMergedAttrs'

withDefaults(
  defineProps<{
    /** Diameter of the spinner (any CSS length, e.g. '2.4rem'). */
    size?: string
  }>(),
  { size: '2.4rem' },
)

defineOptions({ inheritAttrs: false })
const { rootClass, attrs } = useMergedAttrs('spinner')
</script>

<template>
  <span :class="rootClass" :style="{ fontSize: size }" role="status" aria-label="Loading" v-bind="attrs" />
</template>

<style scoped>
@layer components {
  .spinner {
    display: inline-block;
    width: 1em;
    height: 1em;
    border: 0.14em solid currentColor;
    border-right-color: transparent;
    border-radius: var(--radius-round);
    animation: spin 0.7s linear infinite;
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
