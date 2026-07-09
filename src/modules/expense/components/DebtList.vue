<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import DebtCard from './debt-card/DebtCard.vue'
import DebtCardSkeleton from './debt-card/DebtCardSkeleton.vue'
import AppEmpty from '@/shared/components/app/AppEmpty.vue'
import Typography from '@/shared/components/ui/typography/Typography.vue'
import { useDebtList } from '@/modules/expense/composables/useDebtList'
import { useGroupMemberList } from '@/modules/group-member/composables/useGroupMemberList'
import MemberFilterDropdown from '@/modules/group-member/components/MemberFilterDropdown.vue'

const props = defineProps<{ groupId: string }>()
const router = useRouter()

const { data: debts, isPending, query: fetchDebts } = useDebtList(props.groupId)
const { data: members, query: fetchMembers } = useGroupMemberList(props.groupId)

const selectedMemberId = ref<string>()

const filteredDebts = computed(() => {
  if (!selectedMemberId.value) return debts.value
  return debts.value?.filter((debt) => debt.paidBy.id === selectedMemberId.value)
})

function openDetail(debtId: string) {
  router.push(`/groups/${props.groupId}/debts/${debtId}`)
}

onMounted(() => {
  fetchDebts()
  fetchMembers()
})
</script>

<template>
  <div class="flex items-center justify-between p-sm">
    <Typography size="md" weight="semibold" as="div">Khoản nợ</Typography>
    <MemberFilterDropdown v-model:selected-member-id="selectedMemberId" :members="members ?? []" />
  </div>
  <div class="flex flex-col gap-sm px-sm">
    <template v-if="isPending">
      <DebtCardSkeleton v-for="i in 4" :key="i" />
    </template>
    <template v-else-if="filteredDebts?.length">
      <DebtCard v-for="d in filteredDebts" :key="d.id" :debt="d" @detail="openDetail" />
    </template>
    <template v-else>
      <div class="flex flex-col items-center gap-2 py-48">
        <AppEmpty size="lg" />
        <Typography size="sm" color="muted">
          {{ selectedMemberId ? 'Không có khoản nợ phù hợp' : 'Chưa có khoản nợ nào' }}
        </Typography>
      </div>
    </template>
  </div>
</template>
