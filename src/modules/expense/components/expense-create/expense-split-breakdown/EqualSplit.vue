<script setup lang="ts">
import { formatMoney } from '@/shared/utils/money.util'
import Typography from '@/shared/components/ui/typography/Typography.vue'
import type { ExpenseSplit } from '@/modules/expense/schema/expense-create.schema'
import type { SupportedCurrency, SupportedLocale } from '@/shared/types/app-setting.type'

defineProps<{ split: ExpenseSplit; locale: SupportedLocale; currency: SupportedCurrency }>()
</script>

<template>
  <Typography size="md" weight="semibold" class="block text-right">
    {{ formatMoney(split.shareAmount, locale, currency) }}
  </Typography>
</template>
