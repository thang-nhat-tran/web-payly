<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import DebtCard from './debt-card/DebtCard.vue'
import DebtCardSkeleton from './debt-card/DebtCardSkeleton.vue'
import AppEmpty from '@/shared/components/app/AppEmpty.vue'
import Typography from '@/shared/components/ui/typography/Typography.vue'
import Button from '@/shared/components/ui/Button.vue'
import Tooltip from '@/shared/components/ui/Tooltip.vue'
import { useDebtList } from '@/modules/expense/composables/useDebtList'
import { useGroupMemberList } from '@/modules/group-member/composables/useGroupMemberList'
import MemberFilterDropdown from '@/modules/group-member/components/MemberFilterDropdown.vue'
import { localStorageService } from '@/shared/lib/browser-storage/local-storage.service'
import { STORAGE_KEYS } from '@/shared/lib/browser-storage/storage-key.const'

const props = defineProps<{ groupId: string }>()
const router = useRouter()

const { data: debts, isPending, query: fetchDebts } = useDebtList(props.groupId)
const { data: members, query: fetchMembers } = useGroupMemberList(props.groupId)

const selectedMemberId = ref<string>()

const filteredDebts = computed(() => {
  if (!selectedMemberId.value) return debts.value
  return debts.value?.filter((debt) => debt.paidBy.id === selectedMemberId.value)
})

// Multi-select state — entered via long-press on a card, driving the Pay flow below.
const selectionMode = ref(false)
const selectedSplitIds = ref<Set<string>>(new Set())

// Hint tooltip shown until the user discovers long-press once, then hidden for good.
const isSelectionTooltipHidden = ref(
  localStorageService.get<boolean>(STORAGE_KEYS.debtListSelectionTooltipHidden) ?? false,
)

function toggleSelect(splitId: string) {
  const next = new Set(selectedSplitIds.value)
  if (next.has(splitId)) next.delete(splitId)
  else next.add(splitId)
  selectedSplitIds.value = next
  if (next.size === 0) selectionMode.value = false
}

function handleLongPress(splitId: string) {
  selectionMode.value = true
  toggleSelect(splitId)

  isSelectionTooltipHidden.value = true
  localStorageService.set(STORAGE_KEYS.debtListSelectionTooltipHidden, true)
}

function exitSelectionMode() {
  selectionMode.value = false
  selectedSplitIds.value = new Set()
}

function handlePayClick() {
  if (selectedSplitIds.value.size === 0) {
    return
  }
  router.push(`/groups/${props.groupId}/debts/pay?splitIds=${Array.from(selectedSplitIds.value).join(',')}`)
}

function openDetail(debtId: string) {
  router.push(`/groups/${props.groupId}/debts/${debtId}`)
}

onMounted(() => {
  fetchDebts()
  fetchMembers()
})
</script>

<template>
  <div class="flex flex-col gap-2 p-sm">
    <Typography size="md" weight="semibold" as="div">Khoản nợ</Typography>
    <div class="flex items-center gap-xs">
      <MemberFilterDropdown v-model:selected-member-id="selectedMemberId" :members="members ?? []" />
      <Tooltip text="Nhấn giữ một khoản nợ để chọn" :open="!selectionMode && !isSelectionTooltipHidden">
        <Button
          variant="outline"
          size="sm"
          :class="{ 'opacity-40': selectedSplitIds.size === 0 }"
          @click="handlePayClick"
        >
          Thanh toán{{ selectedSplitIds.size ? ` (${selectedSplitIds.size})` : '' }}
        </Button>
      </Tooltip>
      <Button v-if="selectionMode" variant="outline" color="danger" size="sm" @click="exitSelectionMode">Huỷ</Button>
    </div>
  </div>
  <div class="flex flex-col gap-sm px-sm mb-4">
    <template v-if="isPending">
      <DebtCardSkeleton v-for="i in 4" :key="i" />
    </template>
    <template v-else-if="filteredDebts?.length">
      <DebtCard
        v-for="d in filteredDebts"
        :key="d.id"
        :debt="d"
        :selection-mode="selectionMode"
        :selected="selectedSplitIds.has(d.splitId)"
        :selectable="d.status !== 'paid'"
        @detail="openDetail"
        @toggle-select="toggleSelect"
        @long-press="handleLongPress"
      />
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
