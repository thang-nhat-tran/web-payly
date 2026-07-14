<script setup lang="ts">
import { toast } from 'vue-sonner'
import { Upload } from '@/shared/components/ui/upload'
import type { UploadFn, UploadItem } from '@/shared/components/ui/upload'
import { expenseApi } from '@/modules/expense/api/expense.api'
import { useAuthStore } from '@/shared/stores/auth.store'

// `settlements.evidence_image_path` is a single column, so this only ever holds 0-1 paths.
const paths = defineModel<string[]>('paths', { default: () => [] })

const auth = useAuthStore()

const uploadFn: UploadFn = (file) => {
  const userId = auth.profile?.id
  if (!userId) return Promise.reject(new Error('Bạn cần đăng nhập để tải lên bằng chứng thanh toán'))
  return expenseApi.uploadSettlementEvidence(userId, file)
}

function handleUploadError(item: UploadItem) {
  toast.error('Tải ảnh lên thất bại', { description: item.error })
}
</script>

<template>
  <Upload v-model:paths="paths" :upload-fn="uploadFn" :max-files="1" :max-size-m-b="5" @error="handleUploadError" />
</template>
