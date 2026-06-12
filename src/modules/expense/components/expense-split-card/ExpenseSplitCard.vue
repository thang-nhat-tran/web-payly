<script setup lang="ts">
import { Card, CardContent } from '@/shared/components/ui/card'
import UserAvatar from '@/shared/components/ui/Avatar.vue'
import type { ExpenseSplit } from '@/modules/expense/types/expense.types'
import { formatMoney } from '@/shared/utils/currency.util'
import { formatDate } from '@/shared/utils/datetime.util'

defineProps<{ expense: ExpenseSplit }>()
defineEmits<{ pay: [string]; detail: [string] }>()
</script>

<template>
  <Card>
    <CardContent class="p-4">
      <!-- Title + status -->
      <div class="flex justify-between items-center">
        <div class="flex items-center gap-3">
          <UserAvatar :name="expense.paidBy.name" :src="expense.paidBy.avatarUrl" size="sm" />
          <div>
            <p class="text-sm text-text-accent font-bold">{{ expense.title }}</p>
            <p class="text-xs text-text-muted">{{ formatDate(expense.paidAt) }}</p>
          </div>
        </div>
        <p class="text-md font-bold text-text-primary">{{ formatMoney(expense.amount) }}</p>
      </div>

      <!-- Payer info -->
      <div class="flex items-center gap-3 mt-4">
        <div>
          <p>{{ expense.paidBy.name }}</p>
          <p class="text-xs text-text-muted">paid for</p>
        </div>
      </div>
    </CardContent>
  </Card>
</template>
