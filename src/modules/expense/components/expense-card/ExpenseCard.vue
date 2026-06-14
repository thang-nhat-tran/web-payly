<script setup lang="ts">
import { computed } from 'vue'
import { Card, CardContent } from '@/shared/components/ui/card'
import AvatarStack from '@/shared/components/ui/AvatarStack.vue'
import type { PaidExpense } from '@/modules/expense/types/expense.types'
import { formatMoney } from '@/shared/utils/money.util'
import { formatDate } from '@/shared/utils/datetime.util'
import { useAppSettingStore } from '@/shared/stores/app-setting.store'

const props = defineProps<{ expense: PaidExpense }>()
defineEmits<{ detail: [string] }>()

const appSetting = useAppSettingStore()

const debtorAvatars = computed(() => props.expense.debtors.map((d) => d.participant.avatarUrl ?? ''))
const settledCount = computed(() => props.expense.debtors.filter((d) => d.status === 'paid').length)
const isFullySettled = computed(() => props.expense.amountOwedToMe === 0)
</script>

<template>
  <Card clickable @click="$emit('detail', expense.id)">
    <CardContent class="flex flex-col gap-4 p-6">
      <!-- Title + total I paid -->
      <div class="flex items-start justify-between gap-3">
        <div class="min-w-0">
          <p class="truncate text-sm font-bold text-text-accent">{{ expense.title }}</p>
          <p class="text-xs text-text-muted">Bạn đã trả · {{ formatDate(expense.paidAt, appSetting.locale) }}</p>
        </div>
        <p class="shrink-0 text-md font-bold text-text-main">
          {{ formatMoney(expense.totalAmount, appSetting.locale, appSetting.currency) }}
        </p>
      </div>

      <!-- Owed back to me + debtors -->
      <div class="flex items-center justify-between gap-3">
        <div class="min-w-0">
          <p v-if="isFullySettled" class="text-sm font-medium text-[#166534]">Đã thu đủ</p>
          <template v-else>
            <p class="text-xs text-text-muted">Còn được nợ</p>
            <p class="text-sm font-bold text-[#166534]">
              {{ formatMoney(expense.amountOwedToMe, appSetting.locale, appSetting.currency) }}
            </p>
          </template>
        </div>

        <div class="flex items-center gap-3">
          <AvatarStack :avatar-urls="debtorAvatars" size="sm" />
          <span class="text-xs text-text-muted">{{ settledCount }}/{{ expense.debtors.length }} đã trả</span>
        </div>
      </div>
    </CardContent>
  </Card>
</template>
