<script setup lang="ts">
import { useAppSettingStore } from '@/shared/stores/app-setting.store'
import MoneyInput from '@/shared/components/ui/MoneyInput.vue'
import Input from '@/shared/components/ui/Input.vue'
import SplitMemberList from './SplitMemberList.vue'
import type { SplitPercentageMap } from '@/modules/expense/types/expense-split.type'
import type { ExpenseParticipantMap } from '@/modules/expense/types/expense-participant.type'
import type { ExpenseSplit } from '@/modules/expense/schema/expense-create.schema'

const { locale, currency } = useAppSettingStore()

defineProps<{
  expenseParticipantMap: ExpenseParticipantMap
  splits: ExpenseSplit[]
}>()

const percentageMap = defineModel<SplitPercentageMap>({ required: true, default: () => ({}) })

function setPercent(id: string, percent: number) {
  percentageMap.value = { ...percentageMap.value, [id]: percent }
}
</script>

<template>
  <SplitMemberList :expense-participant-map="expenseParticipantMap" :splits="splits">
    <template #default="{ split }">
      <span class="flex items-center gap-2">
        <MoneyInput
          :model-value="split.shareAmount"
          :locale="locale"
          :currency="currency"
          readonly
          class="w-40 justify-start"
          size="sm"
        />
        <span class="flex items-center gap-0.5">
          <Input
            :model-value="percentageMap[split.userId]?.toString() ?? '0'"
            variant="ghost"
            placeholder="0"
            type="number"
            weight="semibold"
            class="w-12 text-right"
            @update:model-value="(newPercent) => setPercent(split.userId, Number(newPercent))"
          />
          <span class="shrink-0 select-none text-sm font-semibold text-text-main">%</span>
        </span>
      </span>
    </template>
  </SplitMemberList>
</template>
