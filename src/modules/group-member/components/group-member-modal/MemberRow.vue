<script setup lang="ts">
import Avatar from '@/shared/components/ui/Avatar.vue'
import { type GroupMember } from '../../types/group-member.type'
import { EllipsisVerticalIcon } from 'lucide-vue-next'
const { member } = defineProps<{
  member: GroupMember
}>()
</script>
<template>
  <div class="flex items-center gap-2">
    <Avatar :src="member.avatarUrl" :name="member.name" size="xs" />
    <div class="flex flex-col">
      <span class="text-md font-medium">{{ member.name }}</span>
      <span class="text-sm text-slate">{{ member.email }}</span>
    </div>
    <EllipsisVerticalIcon class="ml-auto text-slate cursor-pointer" />
  </div>
</template>
