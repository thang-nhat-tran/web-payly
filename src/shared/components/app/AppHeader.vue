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
  if (hasCenter.value) {
    return 'grid h-24 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center'
  }

  if (hasRight.value) {
    return 'flex h-24 items-center justify-between'
  }

  return 'flex h-24 items-center'
})
</script>

<template>
  <header :class="cn('sticky top-0 z-50 bg-bg-layout border-b border-border shadow-sm px-sm', props.class)">
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
