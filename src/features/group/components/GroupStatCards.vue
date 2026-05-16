<script setup lang="ts">
defineProps<{
  pendingAmount: number
  totalAmount: number
}>()

function formatVND(amount: number) {
  return new Intl.NumberFormat('vi-VN').format(amount)
}
</script>

<template>
  <div class="stat-cards">
    <div class="stat-card">
      <span class="stat-label">Chờ thanh toán</span>
      <span class="stat-value stat-value--pending">{{ formatVND(pendingAmount) }}</span>
    </div>
    <div class="divider" />
    <div class="stat-card">
      <span class="stat-label">Tổng chi tiêu của nhóm</span>
      <span class="stat-value stat-value--total">{{ formatVND(totalAmount) }}</span>
    </div>
  </div>
</template>

<style scoped>
.stat-cards {
  display: flex;
  align-items: center;
  background-color: var(--color-surface-white);
  border-radius: var(--radius-cta);
  box-shadow: var(--shadow-card);
  margin: var(--spacing-2);
  padding: var(--spacing-2) var(--spacing-3);
  gap: var(--spacing-2);
}

.stat-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.divider {
  width: 1px;
  min-height: 48px;
  background-color: var(--color-dust);
  align-self: stretch;
  flex-shrink: 0;
}

.stat-label {
  font-size: var(--text-sm);
  color: var(--color-slate);
  font-weight: 450;
  line-height: 1.3;
}

.stat-value {
  font-size: var(--text-h3);
  font-weight: 600;
  letter-spacing: var(--tracking-headline);
  line-height: 1.2;
}

.stat-value--pending {
  color: var(--color-signal);
}

.stat-value--total {
  color: #166534;
}
</style>
