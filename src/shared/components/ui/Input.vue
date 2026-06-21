<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { computed, type HTMLAttributes, type InputHTMLAttributes } from 'vue'
import { cn } from '@/shared/utils/cn.util'

type InputVariant = 'default' | 'ghost'
type InputSize = 'sm' | 'md' | 'lg' | 'xl'
type InputWeight = 'normal' | 'medium' | 'semibold' | 'bold'

const model = defineModel<string>({ default: '' })

const props = withDefaults(
  defineProps<{
    /** `default` is a bordered field; `ghost` is borderless/transparent for inline editing. */
    variant?: InputVariant
    /** Typography (and, for `default`, padding) scale. */
    size?: InputSize
    /** Font weight of the entered text. */
    weight?: InputWeight
    /** Native input type (ignored when `multiline`). */
    type?: InputHTMLAttributes['type']
    /** On-screen keyboard hint for touch devices. */
    inputmode?: InputHTMLAttributes['inputmode']
    /** Placeholder text shown when the control is empty. */
    placeholder?: string
    /** Error message — when set, shows the error state and renders the text below. */
    error?: string
    /** Render a <textarea> instead of an <input>. */
    multiline?: boolean
    /** Consumer classes — tailwind-merged onto the control via cn(). */
    class?: HTMLAttributes['class']
  }>(),
  {
    variant: 'default',
    size: 'md',
    weight: 'normal',
    type: 'text',
  },
)

// Non-class attrs (placeholder, type, inputmode, …) fall through to the control.
defineOptions({ inheritAttrs: false })

// Appearance shared across variants, using semantic design tokens.
const baseClasses =
  'w-full font-sans text-text-main outline-none transition-[border-color] duration-150 ease-standard placeholder:text-text-muted'

// Typography variants — semantic sizes instead of low-level style props.
const sizeClasses: Record<InputSize, string> = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-md',
  xl: 'text-lg',
}

// Inner spacing for the bordered `default` variant (the `ghost` variant is padding-free).
const paddingClasses: Record<InputSize, string> = {
  sm: 'px-3 py-2',
  md: 'px-[14px] py-[10px]',
  lg: 'px-4 py-3',
  xl: 'px-5 py-4',
}

// Font-weight variants.
const weightClasses: Record<InputWeight, string> = {
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
}

const controlClass = computed(() =>
  cn(
    baseClasses,
    sizeClasses[props.size],
    weightClasses[props.weight],
    props.variant === 'ghost'
      ? 'border-0 bg-transparent p-0'
      : cn(
          'rounded-md border-[1.5px] border-text-disabled bg-bg-surface focus:border-text-main',
          paddingClasses[props.size],
        ),
    props.error && 'border-danger-main focus:border-danger-main',
    props.multiline && 'min-h-[40px] resize-y',
    props.class,
  ),
)
</script>

<template>
  <textarea
    v-if="multiline"
    v-model="model"
    :class="controlClass"
    :inputmode="inputmode"
    :placeholder="placeholder"
    v-bind="$attrs"
  />
  <input
    v-else
    v-model="model"
    :class="controlClass"
    :type="type"
    :inputmode="inputmode"
    :placeholder="placeholder"
    v-bind="$attrs"
  />
</template>
