<script setup lang="ts">
import AppLoader from '@/shared/components/app/AppLoader.vue'
import { useRoute, useRouter } from 'vue-router'
import { useGroupJoin } from '../composables/useGroupJoin'
import { onMounted } from 'vue'
import { toast } from 'vue-sonner'

const route = useRoute()
const router = useRouter()
const { mutate: joinGroupByToken, data: groupId, isSuccess: isJoinSuccess, isError: isJoinError } = useGroupJoin()

// The router guard guarantees the user is authenticated before this view mounts.
onMounted(async () => {
  await processJoinGroup(route.params.token as string)
})

const processJoinGroup = async (inviteToken: string) => {
  await joinGroupByToken(inviteToken)
  if (isJoinSuccess.value && groupId.value) {
    toast.success('Tham gia nhóm thành công!')
    router.push({ name: 'GroupDetail', params: { id: groupId.value } })
  }
}
</script>

<template>
  <div class="min-h-screen flex flex-col gap-md justify-center">
    <div v-if="isJoinError" class="text-center text-red-500">Tham gia nhóm thất bại. Vui lòng thử lại sau.</div>
    <div v-else class="text-center text-gray-500">
      <AppLoader size="lg" />
      <div class="text-center">Đang tham gia nhóm...</div>
    </div>
  </div>
</template>
