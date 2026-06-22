<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import DebtCard from './debt-card/DebtCard.vue'
import { useDebtList } from '@/modules/expense/composables/useDebtList'

const props = defineProps<{ groupId: string }>()
const router = useRouter()

const { data: debts, query: fetchDebts } = useDebtList(props.groupId)

function openDetail(debtId: string) {
  router.push(`/groups/${props.groupId}/debts/${debtId}`)
}

onMounted(() => fetchDebts())
</script>

<template>
  <div class="list">
    <DebtCard v-for="d in debts ?? []" :key="d.id" :debt="d" @detail="openDetail" />
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
