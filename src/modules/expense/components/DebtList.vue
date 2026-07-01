<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import DebtCard from './debt-card/DebtCard.vue'
import DebtCardSkeleton from './debt-card/DebtCardSkeleton.vue'
import AppEmpty from '@/shared/components/app/AppEmpty.vue'
import Typography from '@/shared/components/ui/typography/Typography.vue'
import { useDebtList } from '@/modules/expense/composables/useDebtList'

const props = defineProps<{ groupId: string }>()
const router = useRouter()

const { data: debts, isPending, query: fetchDebts } = useDebtList(props.groupId)

function openDetail(debtId: string) {
  router.push(`/groups/${props.groupId}/debts/${debtId}`)
}

onMounted(() => fetchDebts())
</script>

<template>
  <div class="list">
    <template v-if="isPending">
      <DebtCardSkeleton v-for="i in 4" :key="i" />
    </template>
    <template v-else-if="debts?.length">
      <DebtCard v-for="d in debts" :key="d.id" :debt="d" @detail="openDetail" />
    </template>
    <template v-else>
      <div class="empty">
        <AppEmpty size="lg" />
        <Typography size="sm" color="muted">Chưa có khoản nợ nào</Typography>
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

.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-xl) 0;
}
</style>
