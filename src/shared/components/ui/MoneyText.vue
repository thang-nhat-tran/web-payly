<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { computed, type HTMLAttributes } from 'vue'
import { cn } from '@/shared/utils/cn.util'
import { formatMoney } from '@/shared/utils/money.util'
import type { SupportedLocale, SupportedCurrency } from '@/shared/types/app-setting.type'

type MoneyTextVariant = 'default' | 'muted' | 'accent' | 'success' | 'danger'
type MoneyTextSize = 'sm' | 'md' | 'lg' | 'xl'
type MoneyTextWeight = 'normal' | 'medium' | 'semibold' | 'bold'

const props = withDefaults(
  defineProps<{
    /** Amount to display; formatted with the given locale + currency. */
    amount: number
    locale: SupportedLocale
    currency: SupportedCurrency
    /** Semantic text color. */
    variant?: MoneyTextVariant
    /** Typography scale. */
    size?: MoneyTextSize
    /** Font weight. */
    weight?: MoneyTextWeight
    /** Consumer classes — tailwind-merged via cn(). */
    class?: HTMLAttributes['class']
  }>(),
  {
    variant: 'default',
    size: 'md',
    weight: 'normal',
  },
)

const formatted = computed(() => formatMoney(props.amount, props.locale, props.currency))

// Semantic color variants, using design tokens.
const variantClasses: Record<MoneyTextVariant, string> = {
  default: 'text-text-main',
  muted: 'text-text-muted',
  accent: 'text-text-accent',
  success: 'text-success',
  danger: 'text-danger-main',
}

// Typography scale — matches MoneyInput / Input.
const sizeClasses: Record<MoneyTextSize, string> = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-md',
  xl: 'text-lg',
}

const weightClasses: Record<MoneyTextWeight, string> = {
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
}

const textClass = computed(() =>
  cn(variantClasses[props.variant], sizeClasses[props.size], weightClasses[props.weight], props.class),
)
</script>

<template>
  <span :class="textClass">{{ formatted }}</span>
</template>
