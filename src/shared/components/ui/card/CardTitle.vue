<script setup lang="ts">
import { useMergedAttrs } from '@/shared/composables/useMergedAttrs'

defineOptions({ inheritAttrs: false })
const { rootClass, attrs } = useMergedAttrs('')
</script>

<template>
  <h3 :class="rootClass" v-bind="attrs">
    <slot />
  </h3>
</template>
