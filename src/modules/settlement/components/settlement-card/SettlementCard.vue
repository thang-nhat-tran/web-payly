<script setup lang="ts">
import { Paperclip } from 'lucide-vue-next'
import { Card, CardBody } from '@/shared/components/ui/card'
import UserAvatar from '@/shared/components/ui/Avatar.vue'
import Tag from '@/shared/components/ui/Tag.vue'
import Typography from '@/shared/components/ui/typography/Typography.vue'
import { formatRelativeDateLabel } from '@/shared/utils/datetime.util'
import { useAppSettingStore } from '@/shared/stores/app-setting.store'
import { formatMoney } from '@/shared/utils/money.util'
import { getFirstWord } from '@/shared/utils/string.util'
import type { Settlement } from '@/modules/settlement/types/settlement.type'

defineProps<{ settlement: Settlement }>()
const emit = defineEmits<{ detail: [string] }>()

const { locale, currency } = useAppSettingStore()
</script>

<template>
  <Card clickable @click="emit('detail', settlement.id)">
    <CardBody class="flex gap-4 p-6">
      <div class="min-w-0 flex-1 flex flex-col items-start gap-2">
        <div class="flex min-w-0 w-full items-center gap-3">
          <UserAvatar :name="settlement.to.name" :src="settlement.to.avatarUrl" size="md" />
          <div class="min-w-0 flex-1">
            <Typography size="sm" weight="bold" truncate color="main" as="div">{{ settlement.title }}</Typography>
            <Typography size="xs" color="muted">{{ formatRelativeDateLabel(settlement.settledAt, locale) }}</Typography>
          </div>
        </div>
        <div class="flex items-center gap-1">
          <Typography size="xs" weight="regular" as="span">Đã trả cho</Typography>
          <Typography size="xs" weight="semibold" truncate as="span">{{ getFirstWord(settlement.to.name) }}</Typography>
          <Paperclip v-if="settlement.evidenceImagePath" :size="12" class="text-text-secondary" />
        </div>
      </div>

      <div class="shrink-0 flex flex-col items-end justify-center gap-2">
        <Typography size="md" weight="semibold" align="right" color="success">
          {{ formatMoney(settlement.amount, locale, currency) }}
        </Typography>
        <Tag color="success" variant="filled">Đã thanh toán</Tag>
      </div>
    </CardBody>
  </Card>
</template>
