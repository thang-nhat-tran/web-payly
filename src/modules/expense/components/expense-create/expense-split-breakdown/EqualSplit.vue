<script setup lang="ts">
import { useAppSettingStore } from '@/shared/stores/app-setting.store'
import MoneyInput from '@/shared/components/ui/MoneyInput.vue'
import SplitMemberList from './SplitMemberList.vue'
import type { ExpenseParticipantMap } from '@/modules/expense/types/expense-participant.type'
import type { ExpenseSplit } from '@/modules/expense/schema/expense-create.schema'

const { locale, currency } = useAppSettingStore()

defineProps<{
  expenseParticipantMap: ExpenseParticipantMap
  splits: ExpenseSplit[]
}>()
</script>

<template>
  <SplitMemberList :expense-participant-map="expenseParticipantMap" :splits="splits">
    <template #default="{ split }">
      <MoneyInput
        :model-value="split.shareAmount"
        :locale="locale"
        :currency="currency"
        readonly
        class="w-48 justify-end"
        size="sm"
      />
    </template>
  </SplitMemberList>
</template>
