<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { computed, type HTMLAttributes } from 'vue'
import { cn } from '@/shared/utils/cn.util'
import Spinner from './Spinner.vue'

export type ButtonVariant = 'solid' | 'filled' | 'outline' | 'ghost'
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type ButtonIntent = 'primary' | 'danger'

const props = withDefaults(
  defineProps<{
    /** Visual style of the button. */
    variant?: ButtonVariant
    /** Size and padding scale. */
    size?: ButtonSize
    color?: ButtonIntent
    /** Native button type (ignored when `as` overrides the rendered tag). */
    type?: 'button' | 'submit' | 'reset'
    /** Disables interaction; also applied automatically while `loading`. */
    disabled?: boolean
    /** Shows a spinner in place of interaction and disables the button. */
    loading?: boolean
    /** Tag or component to render instead of a native `<button>`, e.g. `RouterLink`. */
    as?: string | object
    /** Consumer classes — tailwind-merged onto the control via cn(). */
    class?: HTMLAttributes['class']
  }>(),
  {
    variant: 'solid',
    size: 'md',
    color: 'primary',
    type: 'button',
    disabled: false,
    loading: false,
    as: 'button',
  },
)

const isNativeButton = computed(() => props.as === 'button')
const isDisabled = computed(() => props.disabled || props.loading)
const spinnerSize = computed(() => (props.size === 'sm' ? '1.6rem' : '2rem'))

// Appearance shared across variants, using semantic design tokens.
const baseClasses =
  'inline-flex shrink-0 items-center justify-center gap-xs whitespace-nowrap rounded-md border-[1.5px] border-transparent text-sm font-medium tracking-tight cursor-pointer select-none outline-none transition-all duration-150 ease-standard active:scale-[0.97] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:shrink-0'

const variantAndColorClasses: Record<ButtonVariant, Record<ButtonIntent, string>> = {
  solid: {
    primary: 'bg-primary text-primary-foreground border-border hover:opacity-[0.88]',
    danger: 'bg-error text-error-foreground border-error hover:opacity-[0.88]',
  },
  filled: {
    primary: 'bg-bg-elevated text-text hover:opacity-[0.88]',
    danger: 'bg-error text-error-foreground hover:opacity-[0.88]',
  },
  outline: {
    primary: 'bg-transparent text-primary border-primary hover:bg-primary/10',
    danger: 'bg-transparent text-error border-error hover:bg-error/10',
  },
  ghost: {
    primary: 'bg-transparent border-transparent text-primary hover:bg-primary/10',
    danger: 'bg-transparent border-transparent text-error hover:bg-error/10',
  },
}

// Padding + sizing scale.
const sizeClasses: Record<ButtonSize, string> = {
  xs: 'px-3 py-1 text-xs',
  sm: 'px-4 py-2 text-sm',
  md: 'px-5 py-2 text-md',
  lg: 'rounded-lg px-8 py-3 text-lg',
  xl: 'rounded-lg px-10 py-4 text-xl',
}

const controlClass = computed(() =>
  cn(baseClasses, variantAndColorClasses[props.variant][props.color], sizeClasses[props.size], props.class),
)
</script>

<template>
  <component
    :is="as"
    data-slot="button"
    :data-variant="variant"
    :data-size="size"
    :type="isNativeButton ? type : undefined"
    :disabled="isNativeButton ? isDisabled : undefined"
    :aria-disabled="!isNativeButton && isDisabled ? 'true' : undefined"
    :aria-busy="loading ? 'true' : undefined"
    :class="controlClass"
  >
    <Spinner v-if="loading" :size="spinnerSize" />
    <slot />
  </component>
</template>
