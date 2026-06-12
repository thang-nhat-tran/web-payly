<script setup lang="ts">
import { useMergedAttrs } from '@/shared/composables/useMergedAttrs'

defineOptions({ inheritAttrs: false })
// Defaults are utilities (not scoped CSS) so consumer overrides like `p-0` win.
const { rootClass, attrs } = useMergedAttrs('flex items-center gap-xs px-lg py-sm')
</script>

<template>
  <div :class="rootClass" v-bind="attrs">
    <slot />
  </div>
</template>
