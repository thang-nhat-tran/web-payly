<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { cn } from '@/shared/utils/cn.util'
import { formatNumber } from '@/shared/utils/number.util'
import { getCurrencySymbol } from '@/shared/utils/money.util'
import type { SupportedLocale, SupportedCurrency } from '@/shared/types/app-setting.type'

type MoneyInputSize = 'sm' | 'md' | 'lg' | 'xl'

const props = withDefaults(
  defineProps<{
    locale: SupportedLocale
    currency: SupportedCurrency
    size?: MoneyInputSize
    placeholderAmount?: number
    readonly?: boolean
  }>(),
  {
    size: 'md',
    placeholderAmount: 0,
    readonly: false,
  },
)

const attrs = useAttrs()

const model = defineModel<number>({ default: 0 })
const numberDisplay = computed(() => (model.value > 0 ? formatNumber(model.value, props.locale) : ''))
const currencySymbol = computed(() => getCurrencySymbol(props.locale, props.currency))

// Internal layout + appearance, using semantic design tokens.
const baseClasses = 'flex items-center gap-1 text-text-main outline-none'

// Typography variants — semantic sizes instead of low-level style props.
const sizeClasses: Record<MoneyInputSize, string> = {
  sm: 'text-sm font-semibold',
  md: 'text-md font-semibold',
  lg: 'text-lg font-semibold',
  xl: 'text-xl font-semibold',
}

const wrapperClass = computed(() => cn(baseClasses, sizeClasses[props.size], attrs.class as string))

function onInput(event: Event) {
  if (props.readonly) return
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
  <div :class="wrapperClass">
    <input
      :value="numberDisplay"
      type="text"
      inputmode="numeric"
      :readonly="readonly"
      :placeholder="String(placeholderAmount)"
      class="min-w-[1ch] border-0 bg-transparent p-0 field-sizing-content text-inherit outline-none placeholder:text-inherit"
      @input="onInput"
    />
    <span class="shrink-0 select-none text-inherit">{{ currencySymbol }}</span>
  </div>
</template>
