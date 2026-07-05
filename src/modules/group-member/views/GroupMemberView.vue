<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { toast } from 'vue-sonner'
import { useGroupDetail } from '@/modules/group/composables/useGroupDetail'
import { useGroupMemberList } from '@/modules/group-member/composables/useGroupMemberList'
import GroupMemberActionBanner from '../components/group-member-list/GroupMemberActionBanner.vue'
import MemberRow from '../components/group-member-list/MemberRow.vue'
import MemberListSkeleton from '../components/group-member-list/MemberListSkeleton.vue'

const { groupId } = defineProps<{
  groupId: string
}>()

const { data: group, query: fetchGroup } = useGroupDetail(groupId)
const { data: members, isPending, isError, query: fetchMembers } = useGroupMemberList(groupId)

const inviteLink = computed(() =>
  group.value ? `${window.location.origin}/join-group/${group.value.inviteToken}` : '',
)

async function handleCopyInvite() {
  await navigator.clipboard.writeText(inviteLink.value)
  toast.info('Đã sao chép link mời', { description: inviteLink.value })
}

onMounted(() => {
  fetchGroup()
  fetchMembers()
})
</script>

<template>
  <main class="flex flex-col gap-md p-sm pb-3xl">
    <GroupMemberActionBanner v-if="group" :description="inviteLink" @action="handleCopyInvite" />

    <MemberListSkeleton v-if="isPending" />
    <p v-else-if="isError" class="text-xs text-danger-main">Không thể tải danh sách thành viên.</p>
    <template v-else>
      <MemberRow v-for="member in members ?? []" :key="member.id" :member="member" class="mb-sm" />
    </template>
  </main>
</template>
