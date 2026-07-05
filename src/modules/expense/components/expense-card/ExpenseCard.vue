<script setup lang="ts">
import { computed } from 'vue'
import { Card, CardBody } from '@/shared/components/ui/card'
import AvatarStack from '@/shared/components/ui/AvatarStack.vue'
import type { PaidExpense } from '@/modules/expense/types/expense.type'
import { formatRelativeDateLabel } from '@/shared/utils/datetime.util'
import { useAppSettingStore } from '@/shared/stores/app-setting.store'
import { formatMoney } from '@/shared/utils/money.util'
import Typography from '@/shared/components/ui/typography/Typography.vue'

const props = defineProps<{ expense: PaidExpense }>()
defineEmits<{ detail: [string] }>()

const { locale, currency } = useAppSettingStore()

const debtorAvatars = computed(() => props.expense.debtors.map((d) => d.participant.avatarUrl ?? ''))
const settledCount = computed(() => props.expense.debtors.filter((d) => d.status === 'paid').length)
</script>

<template>
  <Card clickable @click="$emit('detail', expense.id)">
    <CardBody class="flex gap-4 p-6">
      <div class="flex flex-col min-w-0">
        <Typography size="md" weight="bold" truncate color="main" as="div">{{ expense.title }}</Typography>
        <Typography size="xs" color="muted" as="div">Bạn đã trả</Typography>
        <Typography size="xs" color="muted">{{ formatRelativeDateLabel(expense.paidAt, locale) }}</Typography>
      </div>

      <div class="flex-1 flex flex-col justify-center items-end gap-4">
        <Typography size="md" color="success" weight="semibold" align="right" class="w-48" as="div">
          {{ formatMoney(expense.totalAmount, locale, currency) }}
        </Typography>
        <div class="flex items-center gap-3">
          <AvatarStack :avatar-urls="debtorAvatars" size="xs" />
          <Typography size="xs" color="muted">{{ settledCount }}/{{ expense.debtors.length }} đã trả</Typography>
        </div>
      </div>
    </CardBody>
  </Card>
</template>
