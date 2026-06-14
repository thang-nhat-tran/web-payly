<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { ChevronRight } from 'lucide-vue-next'
import type { HTMLAttributes } from 'vue'
import { cn } from '@/shared/utils/cn.util'

/**
 * A generic tappable row styled like a surface card — leading content in the
 * default slot, an optional `trailing` slot, and a chevron. Use it to open a
 * picker, navigate, or trigger an action.
 */
const props = withDefaults(
  defineProps<{
    /** Hide the trailing chevron. */
    chevron?: boolean
    disabled?: boolean
    class?: HTMLAttributes['class']
  }>(),
  { chevron: true, disabled: false },
)

defineEmits<{ click: [] }>()
</script>

<template>
  <button
    type="button"
    :disabled="disabled"
    :class="
      cn(
        'flex w-full items-center justify-between gap-3 rounded-md bg-bg-surface p-3 text-left shadow-sm transition-opacity hover:opacity-80 disabled:pointer-events-none disabled:opacity-60',
        props.class,
      )
    "
    @click="$emit('click')"
  >
    <span class="flex min-w-0 flex-1 items-center gap-2">
      <slot />
    </span>

    <span v-if="$slots.trailing" class="flex shrink-0 items-center gap-2">
      <slot name="trailing" />
    </span>

    <ChevronRight v-if="chevron" :size="18" class="shrink-0 text-text-muted" />
  </button>
</template>
