<script setup lang="ts">
import { computed } from 'vue'
import type { ExpenseParticipant, SplitMethod } from '@/modules/expense/types/expense.type'
import {
  splitsToSplitAmountMap,
  type SplitAmountMap,
  type SplitPercentageMap,
} from '@/modules/expense/types/expense-split.type'
import type { ExpenseSplit } from '@/modules/expense/schema/expense-create.schema'
import SplitMethodTabs from './SplitMethodTabs.vue'
import EqualSplit from './EqualSplit.vue'
import CustomSplit from './CustomSplit.vue'
import PercentSplit from './PercentSplit.vue'
import SplitBalanceIndicator from './SplitBalanceIndicator.vue'

const props = defineProps<{
  expenseParticipant: ExpenseParticipant[]
  totalAmount: number
  splitAmount: ExpenseSplit[]
}>()

const splitMethod = defineModel<SplitMethod>('splitMethod', { required: true, default: 'equal' })
const customAmountMap = defineModel<SplitAmountMap>('customAmountMap', { required: true, default: () => ({}) })
const percentageMap = defineModel<SplitPercentageMap>('percentageMap', { required: true, default: () => ({}) })

const splitAmountMap = computed<SplitAmountMap>(() => splitsToSplitAmountMap(props.splitAmount))
const allocated = computed(() => props.splitAmount.reduce((sum, s) => sum + s.shareAmount, 0))
</script>

<template>
  <div class="flex flex-col gap-3 rounded-md bg-bg-surface p-4 shadow-sm">
    <!-- Method toggle -->
    <SplitMethodTabs v-model="splitMethod" />

    <!-- Per-method member shares -->
    <EqualSplit
      v-if="splitMethod === 'equal'"
      :expense-participant="expenseParticipant"
      :split-amount-map="splitAmountMap"
    />
    <PercentSplit
      v-else-if="splitMethod === 'percentage'"
      v-model="percentageMap"
      :expense-participant="expenseParticipant"
      :split-amount-map="splitAmountMap"
    />
    <CustomSplit v-else v-model="customAmountMap" :expense-participant="expenseParticipant" />

    <!-- Balance indicator -->
    <SplitBalanceIndicator :allocated="allocated" :total="totalAmount" />
  </div>
</template>
