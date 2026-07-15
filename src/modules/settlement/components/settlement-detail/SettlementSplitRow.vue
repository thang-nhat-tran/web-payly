<script setup lang="ts">
import Typography from '@/shared/components/ui/typography/Typography.vue'
import { formatDate } from '@/shared/utils/datetime.util'
import { useAppSettingStore } from '@/shared/stores/app-setting.store'
import { formatMoney } from '@/shared/utils/money.util'
import type { SettlementSplit } from '@/modules/settlement/types/settlement.type'

defineProps<{ split: SettlementSplit }>()

const { locale, currency } = useAppSettingStore()
</script>

<template>
  <div class="flex items-center justify-between gap-3 py-3">
    <div class="min-w-0 flex-1">
      <Typography size="sm" weight="medium" truncate as="div">{{ split.expenseTitle }}</Typography>
      <Typography size="xs" color="muted">{{ formatDate(split.expenseCreatedAt, locale) }}</Typography>
    </div>
    <Typography size="sm" weight="semibold" color="success">
      {{ formatMoney(split.shareAmount, locale, currency) }}
    </Typography>
  </div>
</template>
