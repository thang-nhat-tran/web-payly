<script setup lang="ts">
import { formatMoney } from '@/shared/utils/money.util'
import { useAppSettingStore } from '@/shared/stores/app-setting.store'

defineProps<{
  pendingAmount: number
  totalAmount: number
}>()

const appSetting = useAppSettingStore()
</script>

<template>
  <div class="stat-cards">
    <div class="stat-card">
      <span class="stat-label">Chờ thanh toán</span>
      <span class="stat-value stat-value--pending">
        {{ formatMoney(pendingAmount, appSetting.locale, appSetting.currency) }}
      </span>
    </div>
    <div class="divider" />
    <div class="stat-card">
      <span class="stat-label">Tổng chi tiêu của nhóm</span>
      <span class="stat-value stat-value--total">
        {{ formatMoney(totalAmount, appSetting.locale, appSetting.currency) }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.stat-cards {
  display: flex;
  align-items: center;
  background-color: var(--color-bg-surface);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
  margin: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  gap: var(--spacing-sm);
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
  background-color: var(--color-text-disabled);
  align-self: stretch;
  flex-shrink: 0;
}

.stat-label {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  font-weight: 450;
  line-height: 1.3;
}

.stat-value {
  font-size: var(--text-md);
  font-weight: 600;
  letter-spacing: var(--tracking-normal);
  line-height: 1.2;
}

.stat-value--pending {
  color: var(--color-danger-main);
}

.stat-value--total {
  color: #166534;
}
</style>
