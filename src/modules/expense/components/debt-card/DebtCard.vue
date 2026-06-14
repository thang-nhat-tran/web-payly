<script setup lang="ts">
import { Card, CardContent } from '@/shared/components/ui/card'
import UserAvatar from '@/shared/components/ui/Avatar.vue'
import StatusBadge from '@/modules/expense/components/StatusBadge.vue'
import type { OwedDebt } from '@/modules/expense/types/expense.types'
import { formatMoney } from '@/shared/utils/money.util'
import { formatDate } from '@/shared/utils/datetime.util'
import { useAppSettingStore } from '@/shared/stores/app-setting.store'

defineProps<{ debt: OwedDebt }>()
defineEmits<{ detail: [string] }>()

const appSetting = useAppSettingStore()
</script>

<template>
  <Card clickable @click="$emit('detail', debt.id)">
    <CardContent class="flex flex-col gap-4 p-6">
      <!-- Who paid + title + amount I owe -->
      <div class="flex items-center justify-between gap-3">
        <div class="flex min-w-0 items-center gap-2">
          <UserAvatar :name="debt.paidBy.name" :src="debt.paidBy.avatarUrl" size="lg" />
          <div class="min-w-0 flex-1">
            <p class="truncate text-sm font-bold text-text-accent">{{ debt.title }}</p>
            <p class="text-xs text-text-muted">{{ formatDate(debt.paidAt, appSetting.locale) }}</p>
          </div>
        </div>
        <p class="text-md font-bold text-danger-main">
          {{ formatMoney(debt.amountIOwe, appSetting.locale, appSetting.currency) }}
        </p>
      </div>

      <!-- Footer: who you owe + status -->
      <div class="flex items-center justify-between gap-3">
        <p class="truncate text-sm">
          Bạn nợ <span class="font-medium">{{ debt.paidBy.name }}</span>
        </p>
        <StatusBadge :status="debt.status" />
      </div>
    </CardContent>
  </Card>
</template>
