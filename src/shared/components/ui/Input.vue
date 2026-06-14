<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { computed, type HTMLAttributes } from 'vue'
import { cn } from '@/shared/utils/cn.util'

const model = defineModel<string>({ required: true })

const props = defineProps<{
  /** `default` is a bordered field; `ghost` is borderless/transparent for inline editing. */
  variant?: 'default' | 'ghost'
  /** Error message — when set, shows the error state and renders the text below. */
  error?: string
  /** Render a <textarea> instead of an <input>. */
  multiline?: boolean
  /** Consumer classes — tailwind-merged onto the control via cn(). */
  class?: HTMLAttributes['class']
}>()

// Non-class attrs (placeholder, type, inputmode, …) fall through to the control.
defineOptions({ inheritAttrs: false })

const controlClass = computed(() =>
  cn(
    'w-full font-sans text-sm text-text-main outline-none transition-[border-color] duration-150 ease-standard placeholder:text-text-muted',
    props.variant === 'ghost'
      ? 'border-0 bg-transparent p-0'
      : 'rounded-md border-[1.5px] border-text-disabled bg-bg-surface px-[14px] py-[10px] focus:border-text-main',
    props.error && 'border-danger-main focus:border-danger-main',
    props.multiline && 'min-h-[40px] resize-y',
    props.class,
  ),
)
</script>

<template>
  <div class="flex flex-col gap-1.5">
    <textarea v-if="multiline" v-model="model" :class="controlClass" v-bind="$attrs" />
    <input v-else v-model="model" :class="controlClass" v-bind="$attrs" />
    <span v-if="error" class="text-xs text-danger-main">{{ error }}</span>
  </div>
</template>
