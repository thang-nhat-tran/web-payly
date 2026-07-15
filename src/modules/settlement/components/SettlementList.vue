<script setup lang="ts">
import AppEmpty from '@/shared/components/app/AppEmpty.vue'
import Typography from '@/shared/components/ui/typography/Typography.vue'
import SettlementCard from './settlement-card/SettlementCard.vue'
import SettlementCardSkeleton from './settlement-card/SettlementCardSkeleton.vue'
import type { Settlement } from '@/modules/settlement/types/settlement.type'

defineProps<{ settlements: Settlement[]; isPending?: boolean }>()
const emit = defineEmits<{ detail: [string] }>()
</script>

<template>
  <div class="flex flex-col gap-sm px-sm mb-4">
    <template v-if="isPending">
      <SettlementCardSkeleton v-for="i in 4" :key="i" />
    </template>
    <template v-else-if="settlements.length">
      <SettlementCard
        v-for="settlement in settlements"
        :key="settlement.id"
        :settlement="settlement"
        @detail="emit('detail', $event)"
      />
    </template>
    <template v-else>
      <div class="flex flex-col items-center gap-2 py-48">
        <AppEmpty size="lg" />
        <Typography size="sm" color="muted">Chưa có khoản thanh toán nào</Typography>
      </div>
    </template>
  </div>
</template>
