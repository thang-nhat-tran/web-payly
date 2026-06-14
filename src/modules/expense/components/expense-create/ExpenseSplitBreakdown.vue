<script setup lang="ts">
import { ref, computed, watchEffect } from 'vue'
import Input from '@/shared/components/ui/Input.vue'
import UserAvatar from '@/shared/components/ui/Avatar.vue'
import type { ExpenseParticipant } from '@/modules/expense/types/expense.types'
import type { ExpenseSplit } from '@/modules/expense/schema/expense-create.schema'
import { formatMoney } from '@/shared/utils/money.util'
import { useAppSettingStore } from '@/shared/stores/app-setting.store'

const appSetting = useAppSettingStore()

const props = defineProps<{
  /** Participants to split among (the payees). */
  members: ExpenseParticipant[]
  /** Total amount to divide; shares must add up to this. */
  total: number
}>()

/** Emits the current per-member shares `{ userId, shareAmount }[]`. */
const model = defineModel<ExpenseSplit[]>({ default: () => [] })

type Mode = 'equal' | 'custom'
const mode = ref<Mode>('equal')
// Custom amounts keyed by user id; persists across membership changes.
const custom = ref<Record<string, number>>({})

/** Even split of `total` across members; the remainder spreads to the first few. */
function equalShares(): ExpenseSplit[] {
  const n = props.members.length
  if (n === 0) return []
  const base = Math.floor(props.total / n)
  let remainder = props.total - base * n
  return props.members.map((m) => {
    const extra = remainder > 0 ? 1 : 0
    if (remainder > 0) remainder--
    return { userId: m.id, shareAmount: base + extra }
  })
}

const shares = computed<ExpenseSplit[]>(() => {
  if (mode.value === 'equal') return equalShares()
  return props.members.map((m) => ({ userId: m.id, shareAmount: custom.value[m.id] ?? 0 }))
})

const shareByUser = computed(() => new Map(shares.value.map((s) => [s.userId, s.shareAmount])))
const allocated = computed(() => shares.value.reduce((sum, s) => sum + s.shareAmount, 0))
const remaining = computed(() => props.total - allocated.value)

// Keep the model in sync with whatever the current mode/inputs produce.
watchEffect(() => {
  model.value = shares.value
})

function setMode(next: Mode) {
  // Seed custom inputs from the current equal split so editing starts balanced.
  if (next === 'custom') {
    const seed: Record<string, number> = {}
    for (const s of equalShares()) seed[s.userId] = s.shareAmount
    custom.value = seed
  }
  mode.value = next
}

function setCustom(userId: string, value: string | undefined) {
  custom.value = { ...custom.value, [userId]: Math.max(0, Math.round(Number(value) || 0)) }
}
</script>

<template>
  <div class="flex flex-col gap-3 rounded-md bg-bg-surface p-4 shadow-sm">
    <!-- Mode toggle -->
    <div class="flex gap-0.5 rounded-md bg-bg-soft p-0.5 text-xs font-medium">
      <button
        type="button"
        class="flex-1 rounded-sm px-3 py-1.5 transition-colors"
        :class="mode === 'equal' ? 'bg-bg-surface text-text-main shadow-sm' : 'text-text-muted'"
        @click="setMode('equal')"
      >
        Chia đều
      </button>
      <button
        type="button"
        class="flex-1 rounded-sm px-3 py-1.5 transition-colors"
        :class="mode === 'custom' ? 'bg-bg-surface text-text-main shadow-sm' : 'text-text-muted'"
        @click="setMode('custom')"
      >
        Tùy chỉnh
      </button>
    </div>

    <!-- Per-member shares -->
    <div v-for="m in members" :key="m.id" class="flex items-center justify-between gap-3">
      <span class="flex min-w-0 items-center gap-2">
        <UserAvatar :name="m.name" :src="m.avatarUrl" size="xs" />
        <span class="truncate text-sm">{{ m.name }}</span>
      </span>

      <span v-if="mode === 'equal'" class="text-sm font-medium text-text-main">
        {{ formatMoney(shareByUser.get(m.id) ?? 0, appSetting.locale, appSetting.currency) }}
      </span>
      <Input
        v-else
        :model-value="String(custom[m.id] ?? 0)"
        variant="ghost"
        type="number"
        inputmode="numeric"
        min="0"
        class="w-28 text-right text-sm font-medium [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        @update:model-value="setCustom(m.id, $event)"
      />
    </div>

    <!-- Balance indicator -->
    <div class="flex items-center justify-between border-t border-bg-soft pt-2 text-xs">
      <span class="text-text-muted">Tổng đã chia</span>
      <span :class="remaining === 0 ? 'font-medium text-green-700' : 'font-medium text-danger-main'">
        {{ formatMoney(allocated, appSetting.locale, appSetting.currency) }}
        <template v-if="remaining !== 0">
          · còn lại {{ formatMoney(remaining, appSetting.locale, appSetting.currency) }}
        </template>
      </span>
    </div>
  </div>
</template>
