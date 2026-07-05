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
  <Typography size="md" weight="semibold" class="p-sm" as="div">Khoản chi</Typography>
  <div class="flex flex-col gap-sm px-sm">
    <template v-if="isPending">
      <ExpenseCardSkeleton v-for="i in 4" :key="i" />
    </template>
    <template v-else-if="expenses?.length">
      <ExpenseCard v-for="e in expenses" :key="e.id" :expense="e" @detail="openDetail" class="" />
    </template>
    <template v-else>
      <div class="flex flex-col items-center gap-2 py-48">
        <AppEmpty size="lg" />
        <Typography size="sm" color="muted">Chưa có khoản chi nào</Typography>
      </div>
    </template>
  </div>
</template>
