<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import DebtCard from './debt-card/DebtCard.vue'
import { mockOwedDebts } from '@/modules/expense/mocks/expense.mock'

const route = useRoute()
const router = useRouter()

function openDetail(debtId: string) {
  router.push(`/groups/${route.params.id}/debts/${debtId}`)
}
</script>

<template>
  <div class="list">
    <DebtCard v-for="d in mockOwedDebts" :key="d.id" :debt="d" @detail="openDetail" />
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
