<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { computed, ref, useAttrs } from 'vue'
import { cn } from '@/shared/utils/cn.util'
import { formatNumber } from '@/shared/utils/number.util'
import { getCurrencySymbol } from '@/shared/utils/money.util'
import type { SupportedLocale, SupportedCurrency } from '@/shared/types/app-setting.type'

type MoneyInputVariant = 'outlined' | 'filled' | 'borderless'
type MoneyInputSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
type MoneyInputAlign = 'left' | 'center' | 'right'
type MoneyInputWeight = 'normal' | 'medium' | 'semibold' | 'bold'

const props = withDefaults(
  defineProps<{
    locale: SupportedLocale
    currency: SupportedCurrency
    variant?: MoneyInputVariant
    size?: MoneyInputSize
    align?: MoneyInputAlign
    weight?: MoneyInputWeight
    placeholderAmount?: number
  }>(),
  {
    variant: 'outlined',
    size: 'md',
    align: 'left',
    weight: 'semibold',
    placeholderAmount: 0,
  },
)

const attrs = useAttrs()
const inputRef = ref<HTMLInputElement | null>(null)
const model = defineModel<number>({ default: 0 })
const numberDisplay = computed(() => (model.value > 0 ? formatNumber(model.value, props.locale) : ''))
const currencySymbol = computed(() => getCurrencySymbol(props.locale, props.currency))

const baseClasses =
  'flex items-center gap-1 text-text-main outline-none transition-[border-color] duration-150 ease-standard cursor-text'

const sizeClasses: Record<MoneyInputSize, string> = {
  xs: 'text-xs p-1',
  sm: 'text-sm p-2',
  md: 'text-md p-3',
  lg: 'text-lg p-4',
  xl: 'text-xl p-5',
}

const weightClasses: Record<MoneyInputWeight, string> = {
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
}

const variantClasses: Record<MoneyInputVariant, string> = {
  outlined: 'rounded-md bg-bg-base shadow-xs border border-border-secondary focus-within:border-border',
  filled: 'rounded-md bg-bg-elevated shadow-md border border-transparent focus-within:border-border',
  borderless: 'border-0 bg-transparent',
}

const justifyClasses: Record<MoneyInputAlign, string> = {
  left: 'justify-start',
  center: 'justify-center',
  right: 'justify-end',
}

const inputJustifyClasses: Record<MoneyInputAlign, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
}

const wrapperClass = computed(() =>
  cn(
    baseClasses,
    sizeClasses[props.size],
    variantClasses[props.variant],
    justifyClasses[props.align],
    weightClasses[props.weight],
    props.variant === 'borderless' && 'p-0',
    attrs.class as string,
  ),
)

function onInput(event: Event) {
  const el = event.target as HTMLInputElement
  model.value = Math.max(0, Number(el.value.replace(/\D/g, '')) || 0)
  el.value = numberDisplay.value
}
</script>

<script lang="ts">
export default {
  inheritAttrs: false,
}
</script>

<template>
  <div :class="wrapperClass" @click="inputRef?.focus()">
    <input
      ref="inputRef"
      :value="numberDisplay"
      type="text"
      inputmode="numeric"
      :placeholder="String(placeholderAmount)"
      :class="
        cn(
          'min-w-[1ch] border-0 bg-transparent p-0 field-sizing-content text-inherit outline-none placeholder:text-text-muted focus:placeholder:text-transparent',
          inputJustifyClasses[props.align],
        )
      "
      @input="onInput"
    />
    <span :class="cn('shrink-0 select-none', model === 0 ? 'text-text-muted' : 'text-text-main')">{{
      currencySymbol
    }}</span>
  </div>
</template>
