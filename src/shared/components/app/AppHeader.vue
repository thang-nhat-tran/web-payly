<script setup lang="ts">
import { computed, useSlots, type HTMLAttributes } from 'vue'
import { cn } from '@/shared/utils/cn.util'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()

const slots = useSlots()

const hasCenter = computed(() => !!slots.center)
const hasRight = computed(() => !!slots.right)

const innerClass = computed(() => {
  if (hasCenter.value || hasRight.value) {
    return 'grid h-20 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center'
  }

  return 'flex h-20 items-center'
})
</script>

<template>
  <header :class="cn('sticky top-0 z-50 px-xs', props.class)">
    <div :class="innerClass">
      <div class="flex min-w-0 items-center justify-start">
        <slot name="left" />
      </div>

      <div v-if="hasCenter" class="flex items-center justify-center">
        <slot name="center" />
      </div>

      <div v-if="hasRight" class="flex min-w-0 items-center justify-end">
        <slot name="right" />
      </div>
    </div>
  </header>
</template>
