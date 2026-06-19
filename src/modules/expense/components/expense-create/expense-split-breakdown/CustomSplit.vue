<script setup lang="ts">
import UserAvatar from '@/shared/components/ui/Avatar.vue'
import type { ExpenseParticipant } from '@/modules/expense/types/expense.type'
import type { SplitAmountMap } from '@/modules/expense/types/expense-split.type'
import { useAppSettingStore } from '@/shared/stores/app-setting.store'
import MoneyInput from '@/shared/components/ui/MoneyInput.vue'

const { locale, currency } = useAppSettingStore()

const props = defineProps<{
  expenseParticipant: ExpenseParticipant[]
}>()

// Editable money amount per member.
const amountMap = defineModel<SplitAmountMap>({ required: true, default: () => ({}) })

function setAmount(id: string, value: number) {
  amountMap.value = { ...amountMap.value, [id]: value }
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

      <MoneyInput
        :model-value="amountMap[participant.id] ?? 0"
        :locale="locale"
        :currency="currency"
        class="w-48 justify-end"
        size="sm"
        @update:model-value="(value) => setAmount(participant.id, value)"
      />
    </div>
  </div>
</template>
