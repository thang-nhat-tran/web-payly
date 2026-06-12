<script setup lang="ts">
import { useMergedAttrs } from '@/shared/composables/useMergedAttrs'

defineOptions({ inheritAttrs: false })
const { rootClass, attrs } = useMergedAttrs('text-md font-medium tracking-normal text-text-main')
</script>

<template>
  <span :class="rootClass" v-bind="attrs">
    <slot />
  </span>
</template>
