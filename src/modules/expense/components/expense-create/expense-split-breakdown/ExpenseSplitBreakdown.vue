<script setup lang="ts">
import { computed } from 'vue'
import {
  type SplitMethod,
  type SplitAmountMap,
  type SplitPercentageMap,
} from '@/modules/expense/types/expense-split.type'
import type { ExpenseSplit } from '@/modules/expense/schema/expense-create.schema'
import type { ExpenseParticipantMap, ExpenseParticipant } from '@/modules/expense/types/expense-participant.type.ts'
import { formatMoney } from '@/shared/utils/money.util'
import { useAppSettingStore } from '@/shared/stores/app-setting.store'
import ParticipantLabel from '@/modules/expense/components/ParticipantLabel.vue'
import Label from '@/shared/components/ui/Label.vue'
import SplitMethodTabs from './SplitMethodTabs.vue'
import SplitBalanceIndicator from './SplitBalanceIndicator.vue'
import EqualSplit from './EqualSplit.vue'
import PercentSplit from './PercentSplit.vue'
import CustomSplit from './CustomSplit.vue'

const { locale, currency } = useAppSettingStore()

const props = defineProps<{
  expenseParticipant: ExpenseParticipant[]
  expenseParticipantMap: ExpenseParticipantMap
  totalAmount: number
  splits: ExpenseSplit[]
  splitTotal: number
}>()

const splitMethod = defineModel<SplitMethod>('splitMethod', { required: true, default: 'equal' })
const customAmountMap = defineModel<SplitAmountMap>('customAmountMap', { required: true, default: () => ({}) })
const percentageMap = defineModel<SplitPercentageMap>('percentageMap', { required: true, default: () => ({}) })

function setPercent(id: string, value: number) {
  percentageMap.value = { ...percentageMap.value, [id]: value }
}

function setAmount(id: string, value: number) {
  customAmountMap.value = { ...customAmountMap.value, [id]: value }
}

const totalPercent = computed(() => Object.values(percentageMap.value).reduce((sum, p) => sum + p, 0))
const remaining = computed(() => props.totalAmount - props.splitTotal)

const indicator = computed(() => {
  if (splitMethod.value === 'percentage') {
    return { label: 'Tổng phần trăm', value: `${totalPercent.value}%`, isError: totalPercent.value !== 100 }
  }
  if (splitMethod.value === 'custom') {
    return { label: 'Còn lại', value: formatMoney(remaining.value, locale, currency), isError: remaining.value !== 0 }
  }
  if (splitMethod.value === 'equal') {
    return {
      label: 'Chia đều mỗi người',
      value: formatMoney(props.splits[0]?.shareAmount || 0, locale, currency),
      isError: false,
    }
  }
  return null
})
</script>

<template>
  <Label>Cách chia</Label>
  <SplitMethodTabs v-model="splitMethod" />

  <div class="mt-4 flex flex-col rounded-md bg-bg-surface shadow-sm">
    <div
      v-for="split in splits"
      :key="split.userId"
      class="flex items-center justify-between gap-3 px-6 py-12 h-20 overflow-hidden border-b border-b-bg-soft last:border-b-0"
    >
      <ParticipantLabel
        :name="expenseParticipantMap[split.userId]?.name"
        :avatar-url="expenseParticipantMap[split.userId]?.avatarUrl"
        size="sm"
      />
      <span class="flex-1">
        <EqualSplit v-if="splitMethod === 'equal'" :split="split" :locale="locale" :currency="currency" />
        <PercentSplit
          v-else-if="splitMethod === 'percentage'"
          :locale="locale"
          :currency="currency"
          :split="split"
          :percentage="percentageMap[split.userId] ?? 0"
          @update:percentage="(v) => setPercent(split.userId, v)"
        />
        <CustomSplit
          v-else
          :split="split"
          :amount="customAmountMap[split.userId] ?? split.shareAmount"
          @update:amount="(v) => setAmount(split.userId, v)"
        />
      </span>
    </div>
  </div>
  <SplitBalanceIndicator
    v-if="indicator"
    :label="indicator.label"
    :value="indicator.value"
    :is-error="indicator.isError"
  />
</template>
