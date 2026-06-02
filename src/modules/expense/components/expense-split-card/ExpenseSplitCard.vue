<script setup lang="ts">
import { Card } from '@/shared/components/ui/card'
import UserAvatar from '@/shared/components/ui/Avatar.vue'
import type { ExpenseSplit, ExpenseSplitStatus } from '@/modules/expense/types/expense.types'
import { formatAmount, formatDate } from './ExpenseSplitCard.helpers'

defineProps<{ expense: ExpenseSplit }>()
defineEmits<{ pay: [string]; detail: [string] }>()

const statusLabel: Record<ExpenseSplitStatus, string> = {
  pending: 'Chưa trả',
  paid: 'Đã trả',
  overdue: 'Quá hạn',
}
</script>

<template>
  <Card>
    <div class="split-card">
      <!-- Title + status -->
      <div class="top-row">
        <p class="title">{{ expense.title }}</p>
        <span class="badge" :class="`badge--${expense.status}`">
          {{ statusLabel[expense.status] }}
        </span>
      </div>

      <!-- Payer info -->
      <div class="payer-row">
        <UserAvatar :name="expense.paidBy.name" :src="expense.paidBy.avatarUrl" size="md" />
        <div class="payer-meta">
          <p class="payer-name">{{ expense.paidBy.name }}</p>
          <p class="payer-date">{{ formatDate(expense.paidAt) }}</p>
        </div>
      </div>

      <!-- Amount -->
      <p class="amount">{{ formatAmount(expense.amount) }}</p>

      <!-- Actions -->
      <div class="actions">
        <button class="btn-detail" @click="$emit('detail', expense.id)">Xem chi tiết</button>
        <button v-if="expense.status !== 'paid'" class="btn-primary btn-pay" @click="$emit('pay', expense.id)">
          Thanh toán
        </button>
      </div>
    </div>
  </Card>
</template>

<style scoped>
.split-card {
  padding: var(--spacing-sm);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.top-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--spacing-xs);
}

.title {
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--color-text-main);
  letter-spacing: var(--tracking-normal);
  line-height: 1.3;
}

.badge {
  flex-shrink: 0;
  font-size: var(--text-xs);
  font-weight: 700;
  letter-spacing: var(--tracking-wide);
  text-transform: uppercase;
  padding: 3px 10px;
  border-radius: var(--radius-pill);
}

.badge--pending {
  background-color: #fff3e0;
  color: #b45309;
}

.badge--paid {
  background-color: #f0fdf4;
  color: #166534;
}

.badge--overdue {
  background-color: #fff0ec;
  color: var(--color-danger-main);
}

.payer-row {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  margin-top: 2px;
}

.payer-meta {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.payer-name {
  font-size: var(--text-xs);
  font-weight: 500;
  color: var(--color-text-secondary);
  line-height: 1.2;
}

.payer-date {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  line-height: 1.2;
}

.amount {
  font-size: var(--text-md);
  font-weight: 600;
  letter-spacing: var(--tracking-normal);
  color: var(--color-text-main);
  margin-top: 4px;
  text-align: right;
}

.actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: var(--spacing-xs);
  margin-top: 4px;
}

.btn-detail {
  display: inline-flex;
  align-items: center;
  padding: 6px 16px;
  border-radius: var(--radius-md);
  background: none;
  color: var(--color-text-main);
  border: 1.5px solid var(--color-text-disabled);
  font-size: var(--text-xs);
  font-weight: 500;
  letter-spacing: var(--tracking-tight);
  cursor: pointer;
  transition: border-color 0.15s var(--ease-standard);
}

.btn-detail:hover {
  border-color: var(--color-text-muted);
}

.btn-pay {
  padding: 6px 20px;
  font-size: var(--text-xs);
}
</style>
