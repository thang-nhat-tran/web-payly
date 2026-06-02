<script setup lang="ts">
import { Modal, ModalHeader, ModalTitle, ModalClose, ModalBody } from '@/shared/components/ui/modal'
import MemberRow from './MemberRow.vue'
import type { GroupMember } from '@/modules/group-member/types/group-member.type.ts'
import { ref } from 'vue'
import GroupMemberActionBanner from './GroupMemberActionBanner.vue'
defineProps<{
  open: boolean
}>()
defineEmits<{
  close: []
}>()
const mockMembers = ref<GroupMember[]>([
  {
    id: 1,
    name: 'Nguyễn Thị Lan',
    email: 'nguyenthiLan@example.com',
    avatarUrl: 'https://img.heroui.chat/image/avatar?w=100&h=100&u=1',
    role: 'admin',
  },
  {
    id: 2,
    name: 'Trần Văn Minh',
    email: 'tranvanminh@example.com',
    avatarUrl: 'https://img.heroui.chat/image/avatar?w=100&h=100&u=2',
    role: 'member',
  },
  {
    id: 3,
    name: 'Lê Thị Hoa',
    email: 'lethishoa@gmail.com',
    avatarUrl: 'https://img.heroui.chat/image/avatar?w=100&h=100&u=3',
    role: 'member',
  },
])
</script>
<template>
  <Modal :open="open" @close="$emit('close')">
    <ModalHeader>
      <ModalTitle>Thành viên nhóm</ModalTitle>
      <ModalClose />
    </ModalHeader>
    <ModalBody class="pb-3 space-y-3">
      <GroupMemberActionBanner />
      <MemberRow v-for="mockMember in mockMembers" :key="mockMember.id" :member="mockMember" class="mb-2" />
    </ModalBody>
  </Modal>
</template>
