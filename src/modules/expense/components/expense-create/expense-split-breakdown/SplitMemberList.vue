<script setup lang="ts">
import ParticipantLabel from '@/modules/expense/components/ParticipantLabel.vue'
import type { ExpenseParticipantMap } from '@/modules/expense/types/expense-participant.type'
import type { ExpenseSplit } from '@/modules/expense/schema/expense-create.schema'

defineProps<{
  expenseParticipantMap: ExpenseParticipantMap
  splits: ExpenseSplit[]
}>()
</script>

<template>
  <div class="flex flex-col gap-3">
    <div v-for="split in splits" :key="split.userId" class="flex items-center justify-between gap-3">
      <ParticipantLabel
        :name="expenseParticipantMap[split.userId]?.name"
        :avatar-url="expenseParticipantMap[split.userId]?.avatarUrl"
        size="xs"
      />

      <!-- Per-method control, supplied by the parent. -->
      <slot :split="split" />
    </div>
  </div>
</template>
