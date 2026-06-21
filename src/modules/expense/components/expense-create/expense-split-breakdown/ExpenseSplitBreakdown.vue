<script setup lang="ts">
import { type SplitMethod } from '@/modules/expense/types/expense.type'
import { type SplitAmountMap, type SplitPercentageMap } from '@/modules/expense/types/expense-split.type'
import type { ExpenseSplit } from '@/modules/expense/schema/expense-create.schema'
import SplitMethodTabs from './SplitMethodTabs.vue'
import EqualSplit from './EqualSplit.vue'
import CustomSplit from './CustomSplit.vue'
import PercentSplit from './PercentSplit.vue'
import SplitBalanceIndicator from './SplitBalanceIndicator.vue'
import {
  type ExpenseParticipantMap,
  type ExpenseParticipant,
} from '@/modules/expense/types/expense-participant.type.ts'

defineProps<{
  expenseParticipant: ExpenseParticipant[]
  expenseParticipantMap: ExpenseParticipantMap
  totalAmount: number
  splits: ExpenseSplit[]
  splitTotal: number
}>()

const splitMethod = defineModel<SplitMethod>('splitMethod', { required: true, default: 'equal' })
const customAmountMap = defineModel<SplitAmountMap>('customAmountMap', { required: true, default: () => ({}) })
const percentageMap = defineModel<SplitPercentageMap>('percentageMap', { required: true, default: () => ({}) })
</script>

<template>
  <div class="flex flex-col gap-3 rounded-md bg-bg-surface p-4 shadow-sm">
    <!-- Method toggle -->
    <SplitMethodTabs v-model="splitMethod" />

    <EqualSplit v-if="splitMethod === 'equal'" :expense-participant-map="expenseParticipantMap" :splits="splits" />
    <PercentSplit
      v-else-if="splitMethod === 'percentage'"
      v-model="percentageMap"
      :expense-participant-map="expenseParticipantMap"
      :splits="splits"
    />
    <CustomSplit v-else v-model="customAmountMap" :expense-participant-map="expenseParticipantMap" :splits="splits" />

    <!-- Balance indicator -->
    <SplitBalanceIndicator :allocated="splitTotal" :total="totalAmount" />
  </div>
</template>
