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
    default: 'bg-bg-soft text-text-muted',
    success: 'bg-success-bg text-success-main',
    danger: 'bg-danger-bg text-text-main',
    warning: 'bg-warning-bg text-danger-light',
    info: 'bg-info-bg text-text-secondary',
  },
  solid: {
    default: 'bg-text-muted text-bg-surface',
    success: 'bg-success-main text-bg-surface',
    danger: 'bg-danger-main text-bg-surface',
    warning: 'bg-danger-light text-bg-surface',
    info: 'bg-text-secondary text-bg-surface',
  },
  outlined: {
    default: 'border-text-disabled text-text-muted',
    success: 'border-success-border text-success-main',
    danger: 'border-danger-border text-danger-main',
    warning: 'border-warning-border text-danger-light',
    info: 'border-info-border text-text-secondary',
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
