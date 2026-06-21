<script setup lang="ts">
import UserAvatar from '@/shared/components/ui/Avatar.vue'
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
      <span class="flex min-w-0 items-center gap-2">
        <UserAvatar
          :name="expenseParticipantMap[split.userId]?.name"
          :src="expenseParticipantMap[split.userId]?.avatarUrl"
          size="xs"
        />
        <span class="truncate text-sm">{{ expenseParticipantMap[split.userId]?.name }}</span>
      </span>

      <!-- Per-method control, supplied by the parent. -->
      <slot :split="split" />
    </div>
  </div>
</template>
