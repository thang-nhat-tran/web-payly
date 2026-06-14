<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import ExpenseCard from './expense-card/ExpenseCard.vue'
import { mockPaidExpenses } from '@/modules/expense/mocks/expense.mock'

const route = useRoute()
const router = useRouter()

function openDetail(expenseId: string) {
  router.push(`/groups/${route.params.id}/expenses/${expenseId}`)
}
</script>

<template>
  <div class="list">
    <ExpenseCard v-for="e in mockPaidExpenses" :key="e.id" :expense="e" @detail="openDetail" />
  </div>
</template>

<style scoped>
.list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-sm) var(--spacing-3xl);
}
</style>
