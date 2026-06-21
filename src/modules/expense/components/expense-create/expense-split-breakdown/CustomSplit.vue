<script setup lang="ts">
import { useAppSettingStore } from '@/shared/stores/app-setting.store'
import MoneyInput from '@/shared/components/ui/MoneyInput.vue'
import SplitMemberList from './SplitMemberList.vue'
import type { SplitAmountMap } from '@/modules/expense/types/expense-split.type'
import type { ExpenseParticipantMap } from '@/modules/expense/types/expense-participant.type'
import type { ExpenseSplit } from '@/modules/expense/schema/expense-create.schema'

const { locale, currency } = useAppSettingStore()

defineProps<{
  expenseParticipantMap: ExpenseParticipantMap
  splits: ExpenseSplit[]
}>()

const amountMap = defineModel<SplitAmountMap>({ required: true, default: () => ({}) })

function setAmount(id: string, value: number) {
  amountMap.value = { ...amountMap.value, [id]: value }
}
</script>

<template>
  <SplitMemberList :expense-participant-map="expenseParticipantMap" :splits="splits">
    <template #default="{ split }">
      <MoneyInput
        :model-value="amountMap[split.userId] ?? split.shareAmount"
        :locale="locale"
        :currency="currency"
        class="w-48 justify-end"
        size="sm"
        @update:model-value="(value) => setAmount(split.userId, value)"
      />
    </template>
  </SplitMemberList>
</template>
