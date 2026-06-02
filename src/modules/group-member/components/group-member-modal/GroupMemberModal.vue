<script setup lang="ts">
import { Modal, ModalHeader, ModalTitle, ModalClose, ModalBody } from '@/shared/components/ui/modal'
import MemberRow from './MemberRow.vue'
import { computed, watch } from 'vue'
import { toast } from 'vue-sonner'
import GroupMemberActionBanner from './GroupMemberActionBanner.vue'
import { useGroupMemberList } from '@/modules/group-member/composables/useGroupMemberList'

const props = defineProps<{
  open: boolean
  groupId: string
  inviteToken: string
}>()
defineEmits<{
  close: []
}>()

const { data: members, isPending, isError, query } = useGroupMemberList()

const inviteLink = computed(() => `${window.location.origin}/join-group/${props.inviteToken}`)

async function handleCopyInvite() {
  await navigator.clipboard.writeText(inviteLink.value)
  toast.info('Đã sao chép link mời', { description: inviteLink.value })
}

watch(
  () => props.open,
  (open) => {
    if (open && props.groupId) query(props.groupId)
  },
)
</script>
<template>
  <Modal :open="open" @close="$emit('close')">
    <ModalHeader>
      <ModalTitle>Thành viên nhóm</ModalTitle>
      <ModalClose />
    </ModalHeader>
    <ModalBody class="pb-md space-y-md">
      <GroupMemberActionBanner :description="inviteLink" @action="handleCopyInvite" />
      <p v-if="isPending" class="text-xs text-text-muted">Đang tải thành viên...</p>
      <p v-else-if="isError" class="text-xs text-danger-main">Không thể tải danh sách thành viên.</p>
      <template v-else>
        <MemberRow v-for="member in members ?? []" :key="member.id" :member="member" class="mb-sm" />
      </template>
    </ModalBody>
  </Modal>
</template>
