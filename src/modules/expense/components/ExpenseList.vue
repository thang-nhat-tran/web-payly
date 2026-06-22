<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import ExpenseCard from './expense-card/ExpenseCard.vue'
import { useExpenseList } from '@/modules/expense/composables/useExpenseList'

const props = defineProps<{ groupId: string }>()
const router = useRouter()

const { data: expenses, query: fetchExpenses } = useExpenseList(props.groupId)

function openDetail(expenseId: string) {
  router.push(`/groups/${props.groupId}/expenses/${expenseId}`)
}

onMounted(() => fetchExpenses())
</script>

<template>
  <div class="list">
    <ExpenseCard v-for="e in expenses ?? []" :key="e.id" :expense="e" @detail="openDetail" />
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
