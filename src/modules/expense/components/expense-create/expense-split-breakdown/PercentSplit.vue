<script setup lang="ts">
import Input from '@/shared/components/ui/Input.vue'
import type { ExpenseSplit } from '@/modules/expense/schema/expense-create.schema'
import type { SupportedCurrency, SupportedLocale } from '@/shared/types/app-setting.type'
import Typography from '@/shared/components/ui/typography/Typography.vue'
import { formatMoney } from '@/shared/utils/money.util'

defineProps<{ split: ExpenseSplit; percentage: number; locale: SupportedLocale; currency: SupportedCurrency }>()
const emit = defineEmits<{ 'update:percentage': [value: number] }>()
</script>

<template>
  <span class="flex items-center justify-end gap-2">
    <span
      class="flex items-center gap-2 rounded-md bg-bg-base px-5 py-2 border border-text-disabled focus-within:border-text-muted"
    >
      <Input
        :model-value="percentage > 0 ? percentage.toString() : ''"
        placeholder="0"
        variant="borderless"
        size="sm"
        weight="semibold"
        type="number"
        class="w-12"
        align="right"
        @update:model-value="(v) => emit('update:percentage', Number(v))"
      />
      <span class="shrink-0 select-none text-sm font-normal text-text-muted">%</span>
    </span>
    <Typography size="md" weight="semibold" align="right" class="block w-48">
      {{ formatMoney(split.shareAmount, locale, currency) }}
    </Typography>
  </span>
</template>
