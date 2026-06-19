<script setup lang="ts">
import UserAvatar from '@/shared/components/ui/Avatar.vue'
import type { ExpenseParticipant } from '@/modules/expense/types/expense.type'
import type { SplitAmountMap } from '@/modules/expense/types/expense-split.type'
import { useAppSettingStore } from '@/shared/stores/app-setting.store'
import { formatMoney } from '@/shared/utils/money.util'

const { locale, currency } = useAppSettingStore()

defineProps<{
  expenseParticipant: ExpenseParticipant[]
  splitAmountMap: SplitAmountMap
}>()
</script>

<template>
  <div class="flex flex-col gap-3">
    <div
      v-for="participant in expenseParticipant"
      :key="participant.id"
      class="flex items-center justify-between gap-3"
    >
      <span class="flex min-w-0 items-center gap-2">
        <UserAvatar :name="participant.name" :src="participant.avatarUrl" size="xs" />
        <span class="truncate text-sm">{{ participant.name }}</span>
      </span>

      <span class="text-sm font-semibold text-text-main">
        {{ formatMoney(splitAmountMap[participant.id] ?? 0, locale, currency) }}
      </span>
    </div>
  </div>
</template>
