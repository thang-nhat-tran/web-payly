<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { computed, watch, type HTMLAttributes } from 'vue'
import { cn } from '@/shared/utils/cn.util'
import { formatNumber } from '@/shared/utils/number.util'
import { getCurrencySymbol } from '@/shared/utils/money.util'
import type { SupportedLocale, SupportedCurrency } from '@/shared/types/app-setting.type'

const props = withDefaults(
  defineProps<{
    locale: SupportedLocale
    currency: SupportedCurrency
    variant?: 'default' | 'ghost'
    placeholder?: string
    /** Classes for the wrapper. */
    class?: HTMLAttributes['class']
    /** Classes for the inner <input> (e.g. width, alignment, placeholder color). */
    inputClass?: HTMLAttributes['class']
  }>(),
  { variant: 'default' },
)

const model = defineModel<number>({ default: 0 })
const numberDisplay = computed(() => (model.value > 0 ? formatNumber(model.value, props.locale) : ''))
const currencySymbol = computed(() => getCurrencySymbol(props.locale, props.currency))
const inputSize = computed(() => Math.max((numberDisplay.value || props.placeholder || '0').length, 1))
watch(inputSize, () => {
  console.log(inputSize.value)
})

function onInput(event: Event) {
  const el = event.target as HTMLInputElement
  // Keep digits only; re-render from `model`, so non-digits never stick.
  model.value = Math.max(0, Number(el.value.replace(/\D/g, '')) || 0)
  el.value = numberDisplay.value
}

const wrapperClass = computed(() =>
  cn(
    'flex items-center outline-none gap-2',
    props.variant === 'default' &&
      'rounded-md border-[1.5px] border-text-disabled bg-bg-surface px-[14px] py-[10px] transition-[border-color] duration-150 ease-standard focus-within:border-text-main',
    props.class,
  ),
)
</script>

<template>
  <div :class="wrapperClass">
    <input
      :value="numberDisplay"
      type="text"
      inputmode="numeric"
      :placeholder="placeholder ?? '0'"
      :class="
        cn(
          'min-w-[1ch] border-0 bg-transparent p-0 field-sizing-content outline-none placeholder:text-text-disabled',
          props.inputClass,
        )
      "
      @input="onInput"
    />
    <!-- Read-only currency symbol; user edits the number only. -->
    <span class="shrink-0 select-none">{{ currencySymbol }}</span>
  </div>
</template>
