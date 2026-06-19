<script setup lang="ts">
import UserAvatar from '@/shared/components/ui/Avatar.vue'
import type { ExpenseParticipant } from '@/modules/expense/types/expense.type'
import type { SplitAmountMap, SplitPercentageMap } from '@/modules/expense/types/expense-split.type'
import { useAppSettingStore } from '@/shared/stores/app-setting.store'
import { formatMoney } from '@/shared/utils/money.util'

const { locale, currency } = useAppSettingStore()

const props = defineProps<{
  expenseParticipant: ExpenseParticipant[]
  /** Computed money shares (derived from the percentages) shown alongside each input. */
  splitAmountMap: SplitAmountMap
}>()

// Editable percentage per member.
const percentageMap = defineModel<SplitPercentageMap>({ required: true, default: () => ({}) })

function setPercent(id: string, event: Event) {
  const el = event.target as HTMLInputElement
  const value = Math.max(0, Number(el.value.replace(/[^\d.]/g, '')) || 0)
  percentageMap.value = { ...percentageMap.value, [id]: value }
}
</script>

<template>
  <div class="flex flex-col gap-3">
    <div
      v-for="participant in props.expenseParticipant"
      :key="participant.id"
      class="flex items-center justify-between gap-3"
    >
      <span class="flex min-w-0 items-center gap-2">
        <UserAvatar :name="participant.name" :src="participant.avatarUrl" size="xs" />
        <span class="truncate text-sm">{{ participant.name }}</span>
      </span>

      <span class="flex items-center gap-2">
        <span class="text-xs text-text-muted">
          {{ formatMoney(splitAmountMap[participant.id] ?? 0, locale, currency) }}
        </span>
        <span class="flex items-center gap-0.5 text-sm font-semibold text-text-main">
          <input
            :value="percentageMap[participant.id] || ''"
            type="text"
            inputmode="decimal"
            placeholder="0"
            class="w-12 min-w-[1ch] border-0 bg-transparent p-0 text-right field-sizing-content outline-none"
            @input="(event) => setPercent(participant.id, event)"
          />
          <span class="shrink-0 select-none">%</span>
        </span>
      </span>
    </div>
  </div>
</template>
