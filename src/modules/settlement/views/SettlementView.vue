<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Typography from '@/shared/components/ui/typography/Typography.vue'
import SettlementList from '@/modules/settlement/components/SettlementList.vue'
import { useSettlementList } from '@/modules/settlement/composables/useSettlementList'

const { groupId } = defineProps<{ groupId: string }>()
const router = useRouter()

const { data: settlements, isPending, query: fetchSettlements } = useSettlementList(groupId)

function openDetail(settlementId: string) {
  router.push(`/groups/${groupId}/settlements/${settlementId}`)
}

onMounted(() => fetchSettlements())
</script>

<template>
  <div class="flex flex-col gap-2 p-sm">
    <Typography size="md" weight="semibold" as="div">Đã thanh toán</Typography>
  </div>
  <SettlementList :settlements="settlements ?? []" :is-pending="isPending" @detail="openDetail" />
</template>
