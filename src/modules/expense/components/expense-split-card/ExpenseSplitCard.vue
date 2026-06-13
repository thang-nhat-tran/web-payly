<script setup lang="ts">
import { Card, CardContent } from '@/shared/components/ui/card'
import UserAvatar from '@/shared/components/ui/Avatar.vue'
import type { ExpenseSplit } from '@/modules/expense/types/expense.types'
import { formatMoney } from '@/shared/utils/currency.util'
import { formatDate } from '@/shared/utils/datetime.util'
import AvatarStack from '@/shared/components/ui/AvatarStack.vue'

defineProps<{ expense: ExpenseSplit }>()
defineEmits<{ pay: [string]; detail: [string] }>()

const mockPayeeAvatar = [
  'https://img.heroui.chat/image/avatar?w=400&h=400&u=101',
  'https://img.heroui.chat/image/avatar?w=400&h=400&u=100',
  'https://img.heroui.chat/image/avatar?w=400&h=400&u=102',
  'https://img.heroui.chat/image/avatar?w=400&h=400&u=103',
  'https://img.heroui.chat/image/avatar?w=400&h=400&u=104',
  'https://img.heroui.chat/image/avatar?w=400&h=400&u=105',
]
</script>

<template>
  <Card>
    <CardContent class="p-6 flex flex-col gap-8">
      <!-- Title + status -->
      <div class="flex justify-between items-center gap-3">
        <div class="flex items-center gap-2 min-w-0">
          <UserAvatar :name="expense.paidBy.name" :src="expense.paidBy.avatarUrl" size="lg" />
          <div class="flex-1 min-w-0">
            <p class="text-sm text-text-accent font-bold truncate">{{ expense.title }}</p>
            <p class="text-xs text-text-muted">{{ formatDate(expense.paidAt) }}</p>
          </div>
        </div>
        <p class="text-md font-bold text-text-primary">{{ formatMoney(expense.amount) }}</p>
      </div>

      <!-- Payer info -->
      <div class="flex justify-between items-center gap-3 mt-4">
        <div class="flex-1 min-w-0">
          <p class="truncate">{{ expense.paidBy.name }}</p>
          <p class="text-xs text-text-muted">paid for</p>
        </div>
        <AvatarStack :avatar-urls="mockPayeeAvatar" size="sm" />
      </div>
    </CardContent>
  </Card>
</template>
