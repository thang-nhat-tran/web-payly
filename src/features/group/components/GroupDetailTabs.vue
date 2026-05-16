<script setup lang="ts">
import { SlidersHorizontal } from 'lucide-vue-next'
import type { DetailTab } from '@/features/group/types/group.types'

defineProps<{ active: DetailTab }>()
defineEmits<{ select: [DetailTab] }>()
</script>

<template>
  <div class="tabs">
    <div class="tab-list">
      <button
        class="tab"
        :class="{ 'tab--active': active === 'bills' }"
        @click="$emit('select', 'bills')"
      >
        Hóa đơn
      </button>
      <button
        class="tab"
        :class="{ 'tab--active': active === 'members' }"
        @click="$emit('select', 'members')"
      >
        Thành viên
      </button>
      <button
        class="tab"
        :class="{ 'tab--active': active === 'settlement' }"
        @click="$emit('select', 'settlement')"
      >
        Kết toán
      </button>
    </div>
    <button class="filter-btn" aria-label="Bộ lọc">
      <SlidersHorizontal :size="18" :stroke-width="1.5" />
    </button>
  </div>
</template>

<style scoped>
.tabs {
  display: flex;
  align-items: center;
  border-bottom: 1px solid var(--color-dust);
  padding: 0 var(--spacing-1);
}

.tab-list {
  display: flex;
  flex: 1;
}

.tab {
  padding: var(--spacing-2) var(--spacing-2);
  font-size: var(--text-base);
  font-weight: 450;
  color: var(--color-slate);
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  margin-bottom: -1px;
  transition:
    color 0.15s var(--ease-standard),
    border-color 0.15s var(--ease-standard);
}

.tab--active {
  color: var(--color-ink);
  font-weight: 600;
  border-bottom-color: var(--color-ink);
}

.filter-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: var(--radius-circle);
  background: none;
  border: none;
  color: var(--color-slate);
  cursor: pointer;
  transition: color 0.15s var(--ease-standard);
}

.filter-btn:hover {
  color: var(--color-ink);
}
</style>
