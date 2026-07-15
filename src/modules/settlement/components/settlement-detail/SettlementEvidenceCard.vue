<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Card, CardBody } from '@/shared/components/ui/card'
import { Modal, ModalHeader, ModalTitle, ModalClose, ModalBody } from '@/shared/components/ui/modal'
import Typography from '@/shared/components/ui/typography/Typography.vue'
import Skeleton from '@/shared/components/ui/Skeleton.vue'
import { useSettlementEvidenceUrl } from '@/modules/settlement/composables/useSettlementEvidenceUrl'

const props = defineProps<{ path: string | null }>()

const { data: url, isPending, isError, query: fetchUrl } = useSettlementEvidenceUrl(props.path ?? '')
const previewOpen = ref(false)

onMounted(() => {
  if (props.path) fetchUrl()
})
</script>

<template>
  <Card>
    <CardBody class="flex flex-col gap-2 p-6">
      <Typography size="sm" weight="semibold">Bằng chứng thanh toán</Typography>

      <Typography v-if="!path" size="sm" color="muted">Không có bằng chứng thanh toán</Typography>

      <Skeleton v-else-if="isPending" width="100%" height="10rem" />

      <Typography v-else-if="isError || !url" size="sm" color="danger">Không thể tải ảnh bằng chứng.</Typography>

      <button
        v-else
        type="button"
        class="cursor-pointer overflow-hidden rounded-md border border-border"
        @click="previewOpen = true"
      >
        <img :src="url" alt="Bằng chứng thanh toán" class="max-h-60 w-full object-cover" />
      </button>
    </CardBody>
  </Card>

  <Modal v-if="url" :open="previewOpen" @close="previewOpen = false">
    <ModalHeader>
      <ModalTitle>Bằng chứng thanh toán</ModalTitle>
      <ModalClose />
    </ModalHeader>
    <ModalBody class="pb-md">
      <img :src="url" alt="Bằng chứng thanh toán" class="w-full rounded-md" />
    </ModalBody>
  </Modal>
</template>
