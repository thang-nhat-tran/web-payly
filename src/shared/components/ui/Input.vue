<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { computed, type HTMLAttributes, type InputHTMLAttributes } from 'vue'
import { cn } from '@/shared/utils/cn.util'

type InputVariant = 'outlined' | 'fill' | 'borderless'
type InputSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
type InputWeight = 'normal' | 'medium' | 'semibold' | 'bold'
type InputAlign = 'left' | 'center' | 'right'

const model = defineModel<string>({ default: '' })

const props = withDefaults(
  defineProps<{
    /** `outlined` — bordered + shadow; `fill` — no border, matches page background; `borderless` — transparent, no border, no padding (inline editing). */
    variant?: InputVariant
    /** Typography and padding scale — mirrors MoneyInput sizes. */
    size?: InputSize
    /** Font weight of the entered text. */
    weight?: InputWeight
    /** Text alignment. */
    align?: InputAlign
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
    variant: 'outlined',
    size: 'md',
    weight: 'normal',
    align: 'left',
    type: 'text',
  },
)

// Non-class attrs (placeholder, type, inputmode, …) fall through to the control.
defineOptions({ inheritAttrs: false })

// Appearance shared across variants, using semantic design tokens.
const baseClasses =
  'w-full font-sans text-text-main outline-none transition-[border-color] duration-150 ease-standard placeholder:text-text-disabled focus:placeholder:text-transparent'

// Typography + padding scale — mirrors MoneyInput (xs→text-xs, sm→text-sm, …).
const sizeClasses: Record<InputSize, string> = {
  xs: 'p-4 text-xs',
  sm: 'p-5 text-sm',
  md: 'p-6 text-md',
  lg: 'p-7 text-lg',
  xl: 'p-8 text-xl',
}

// Font-weight variants.
const weightClasses: Record<InputWeight, string> = {
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
}

// Text alignment.
const alignClasses: Record<InputAlign, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
}

const variantClasses: Record<InputVariant, string> = {
  outlined: 'rounded-md bg-bg-soft shadow-xs border border-text-disabled focus-within:border-text-muted',
  fill: 'rounded-md bg-bg-surface shadow-md border border-transparent focus-within:border-text-disabled',
  borderless: 'border-0 bg-transparent',
}

const controlClass = computed(() =>
  cn(
    baseClasses,
    sizeClasses[props.size],
    weightClasses[props.weight],
    alignClasses[props.align],
    variantClasses[props.variant],
    props.variant === 'borderless' && 'p-0',
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
