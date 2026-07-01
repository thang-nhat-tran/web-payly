<script setup lang="ts">
import { computed } from 'vue'
import { Card, CardContent } from '@/shared/components/ui/card'
import UserAvatar from '@/shared/components/ui/Avatar.vue'
import Tag, { type TagColor } from '@/shared/components/ui/Tag.vue'
import type { OwedDebt } from '@/modules/expense/types/expense.type'
import { formatRelativeDateLabel } from '@/shared/utils/datetime.util'
import { useAppSettingStore } from '@/shared/stores/app-setting.store'
import { formatMoney } from '@/shared/utils/money.util'
import Typography from '@/shared/components/ui/typography/Typography.vue'
import { getFirstWord } from '@/shared/utils/string.util'

const props = defineProps<{ debt: OwedDebt }>()
defineEmits<{ detail: [string] }>()

const { locale, currency } = useAppSettingStore()

const statusConfig = computed<{ label: string; color: TagColor }>(() =>
  props.debt.status === 'paid' ? { label: 'Đã trả', color: 'success' } : { label: 'Chưa trả', color: 'default' },
)
</script>

<template>
  <Card clickable @click="$emit('detail', debt.id)">
    <CardContent class="flex gap-4 p-6">
      <div class="min-w-0 flex-1 flex flex-col items-start gap-2">
        <div class="flex min-w-0 items-center gap-3 w-full">
          <UserAvatar :name="debt.paidBy.name" :src="debt.paidBy.avatarUrl" size="md" />
          <div class="min-w-0 flex-1">
            <Typography size="sm" weight="bold" truncate color="main" as="div">{{ debt.title }}</Typography>
            <Typography size="xs" color="muted">{{ formatRelativeDateLabel(debt.paidAt, locale) }}</Typography>
          </div>
        </div>
        <div class="flex items-center gap-1">
          <Typography size="xs" weight="semibold" truncate as="span">{{ getFirstWord(debt.paidBy.name) }}</Typography>
          <Typography size="xs" weight="regular" as="span">đã trả cho bạn</Typography>
        </div>
      </div>

      <div class="shrink-0 flex flex-col items-end justify-center gap-2">
        <Typography size="md" weight="semibold" align="right" color="danger">
          {{ formatMoney(debt.amountIOwe, locale, currency) }}
        </Typography>
        <Tag :color="statusConfig.color" variant="filled">{{ statusConfig.label }}</Tag>
      </div>
    </CardContent>
  </Card>
</template>
