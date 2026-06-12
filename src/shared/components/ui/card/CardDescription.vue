<script setup lang="ts">
import { useMergedAttrs } from '@/shared/composables/useMergedAttrs'

defineOptions({ inheritAttrs: false })
const { rootClass, attrs } = useMergedAttrs('text-sm text-text-muted leading-[1.4]')
</script>

<template>
  <p :class="rootClass" v-bind="attrs">
    <slot />
  </p>
</template>
