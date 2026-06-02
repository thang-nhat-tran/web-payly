<script setup lang="ts">
import ExpenseSplitCard from './expense-split-card/ExpenseSplitCard.vue'
import type { ExpenseSplit } from '@/modules/expense/types/expense.types'

defineEmits<{ pay: [string]; detail: [string] }>()

const mockExpenses: ExpenseSplit[] = [
  {
    id: '1',
    title: 'Ăn tối Nhà hàng Hương Vị',
    paidBy: { name: 'Trần Thị Lan', avatarUrl: 'https://img.heroui.chat/image/avatar?w=100&h=100&u=4' },
    paidAt: '2026-05-10T18:30:00',
    amount: 150000,
    status: 'overdue',
  },
  {
    id: '2',
    title: 'Xăng xe đi Vũng Tàu',
    paidBy: { name: 'Nguyễn Văn Hùng', avatarUrl: 'https://img.heroui.chat/image/avatar?w=100&h=100&u=5' },
    paidAt: '2026-05-12T09:00:00',
    amount: 85000,
    status: 'pending',
  },
  {
    id: '3',
    title: 'Tiền phòng khách sạn',
    paidBy: { name: 'Lê Minh Khoa', avatarUrl: 'https://img.heroui.chat/image/avatar?w=100&h=100&u=6' },
    paidAt: '2026-05-13T14:00:00',
    amount: 420000,
    status: 'paid',
  },
  {
    id: '4',
    title: 'Vé cáp treo Núi Bà Đen',
    paidBy: { name: 'Phạm Bảo Ngọc', avatarUrl: 'https://img.heroui.chat/image/avatar?w=100&h=100&u=7' },
    paidAt: '2026-05-15T10:15:00',
    amount: 200000,
    status: 'pending',
  },
]
</script>

<template>
  <div class="split-list">
    <ExpenseSplitCard
      v-for="expense in mockExpenses"
      :key="expense.id"
      :expense="expense"
      @pay="$emit('pay', $event)"
      @detail="$emit('detail', $event)"
    />
  </div>
</template>

<style scoped>
.split-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-sm) var(--spacing-3xl);
}
</style>
