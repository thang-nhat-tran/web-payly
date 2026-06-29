<script setup lang="ts">
import { Card, CardContent } from '@/shared/components/ui/card'
import UserAvatar from '@/shared/components/ui/Avatar.vue'
import StatusBadge from '@/modules/expense/components/StatusBadge.vue'
import type { OwedDebt } from '@/modules/expense/types/expense.type'
import { formatDate } from '@/shared/utils/datetime.util'
import { useAppSettingStore } from '@/shared/stores/app-setting.store'
import { formatMoney } from '@/shared/utils/money.util'
import Typography from '@/shared/components/ui/typography/Typography.vue'

defineProps<{ debt: OwedDebt }>()
defineEmits<{ detail: [string] }>()

const { locale, currency } = useAppSettingStore()
</script>

<template>
  <Card clickable @click="$emit('detail', debt.id)">
    <CardContent class="flex flex-col gap-4 p-6">
      <!-- Who paid + title + amount I owe -->
      <div class="flex items-center justify-between gap-3">
        <div class="flex min-w-0 items-center gap-2">
          <UserAvatar :name="debt.paidBy.name" :src="debt.paidBy.avatarUrl" size="lg" />
          <div class="min-w-0 flex-1">
            <Typography size="sm" weight="bold" truncate color="main" as="div">{{ debt.title }}</Typography>
            <Typography size="xs" color="muted">{{ formatDate(debt.paidAt, locale) }}</Typography>
          </div>
        </div>
        <Typography size="md" weight="semibold" align="right" class="w-48">
          {{ formatMoney(debt.amountIOwe, locale, currency) }}
        </Typography>
      </div>

      <!-- Footer: who you owe + status -->
      <div class="flex items-center justify-between gap-3">
        <Typography size="sm" truncate>
          Bạn nợ <span class="font-semibold">{{ debt.paidBy.name }}</span>
        </Typography>
        <StatusBadge :status="debt.status" />
      </div>
    </CardContent>
  </Card>
</template>
