<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/shared/utils/cn.util'

// Slots: left (brand / logo), center (nav links), right (actions / user)
const props = defineProps<{
  /** Consumer classes — tailwind-merged onto the root <header> via cn(). */
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <header :class="cn('sticky top-0 z-50 px-xs', props.class)">
    <div class="grid h-20 grid-cols-[1fr_auto_1fr] items-center">
      <div class="flex items-center justify-start">
        <slot name="left" />
      </div>

      <div class="flex items-center justify-center">
        <slot name="center" />
      </div>

      <div class="flex items-center justify-end">
        <slot name="right" />
      </div>
    </div>
  </header>
</template>
