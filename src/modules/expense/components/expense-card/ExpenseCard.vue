<script setup lang="ts">
import { computed } from 'vue'
import { Card, CardContent } from '@/shared/components/ui/card'
import AvatarStack from '@/shared/components/ui/AvatarStack.vue'
import MoneyText from '@/shared/components/ui/MoneyText.vue'
import type { PaidExpense } from '@/modules/expense/types/expense.type'
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
      <div class="flex items-center justify-between gap-3">
        <div class="min-w-0">
          <p class="truncate text-sm font-bold text-text-accent">{{ expense.title }}</p>
          <p class="text-xs text-text-muted">Bạn đã trả · {{ formatDate(expense.paidAt, appSetting.locale) }}</p>
        </div>
        <MoneyText
          :amount="expense.totalAmount"
          :locale="appSetting.locale"
          :currency="appSetting.currency"
          size="lg"
          weight="bold"
          class="shrink-0"
        />
      </div>

      <!-- Owed back to me + debtors -->
      <div class="flex items-center justify-between gap-3">
        <div class="min-w-0">
          <p v-if="isFullySettled" class="text-sm font-medium text-success">Đã thu đủ</p>
          <template v-else>
            <p class="text-xs text-text-muted">Còn được nợ</p>
            <MoneyText
              :amount="expense.amountOwedToMe"
              :locale="appSetting.locale"
              :currency="appSetting.currency"
              variant="success"
              size="md"
              weight="bold"
            />
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
