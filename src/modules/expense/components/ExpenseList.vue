<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import ExpenseCard from './expense-card/ExpenseCard.vue'
import ExpenseCardSkeleton from './expense-card/ExpenseCardSkeleton.vue'
import AppEmpty from '@/shared/components/app/AppEmpty.vue'
import Typography from '@/shared/components/ui/typography/Typography.vue'
import { useExpenseList } from '@/modules/expense/composables/useExpenseList'

const props = defineProps<{ groupId: string }>()
const router = useRouter()

const { data: expenses, isPending, query: fetchExpenses } = useExpenseList(props.groupId)

function openDetail(expenseId: string) {
  router.push(`/groups/${props.groupId}/expenses/${expenseId}`)
}

onMounted(() => fetchExpenses())
</script>

<template>
  <div class="list">
    <template v-if="isPending">
      <ExpenseCardSkeleton v-for="i in 4" :key="i" />
    </template>
    <template v-else-if="expenses?.length">
      <ExpenseCard v-for="e in expenses" :key="e.id" :expense="e" @detail="openDetail" />
    </template>
    <template v-else>
      <div class="flex flex-col items-center gap-2 py-48">
        <AppEmpty size="lg" />
        <Typography size="sm" color="muted">Chưa có khoản chi nào</Typography>
      </div>
    </template>
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
