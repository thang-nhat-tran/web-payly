<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { cn } from '@/shared/utils/cn.util'

export type TagVariant = 'filled' | 'solid' | 'outlined'
export type TagColor = 'default' | 'success' | 'danger' | 'warning' | 'info'

const props = withDefaults(defineProps<{ variant?: TagVariant; color?: TagColor }>(), {
  variant: 'filled',
  color: 'default',
})

const attrs = useAttrs()

const variantColorClasses: Record<TagVariant, Record<TagColor, string>> = {
  filled: {
    default: 'bg-bg-layout text-text-secondary',
    success: 'bg-success/10 text-success',
    danger: 'bg-error/10 text-error',
    warning: 'bg-warning/10 text-warning',
    info: 'bg-info/10 text-info',
  },
  solid: {
    default: 'bg-text-secondary text-bg-elevated',
    success: 'bg-success text-success-foreground',
    danger: 'bg-error text-error-foreground',
    warning: 'bg-warning text-warning-foreground',
    info: 'bg-info text-info-foreground',
  },
  outlined: {
    default: 'border-border text-text-secondary',
    success: 'border-success text-success',
    danger: 'border-error text-error',
    warning: 'border-warning text-warning',
    info: 'border-info text-info',
  },
}

const tagClass = computed(() =>
  cn(
    'inline-flex items-center border border-transparent rounded-pill',
    'px-[10px] py-[1px] text-xs font-medium leading-[1.8] whitespace-nowrap select-none',
    variantColorClasses[props.variant][props.color],
    attrs.class as string,
  ),
)
</script>

<script lang="ts">
export default {
  inheritAttrs: false,
}
</script>

<template>
  <span v-bind="attrs" :class="tagClass">
    <slot />
  </span>
</template>
