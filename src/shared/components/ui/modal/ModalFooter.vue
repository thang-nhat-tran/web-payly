<script setup lang="ts">
import { useMergedAttrs } from '@/shared/composables/useMergedAttrs'

defineOptions({ inheritAttrs: false })
const { rootClass, attrs } = useMergedAttrs('flex items-center justify-end gap-xs p-md')
</script>

<template>
  <div :class="rootClass" v-bind="attrs">
    <slot />
  </div>
</template>
