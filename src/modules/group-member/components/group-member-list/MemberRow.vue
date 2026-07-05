<script setup lang="ts">
import Avatar from '@/shared/components/ui/Avatar.vue'
import { type GroupMember } from '../../types/group-member.type'
import { EllipsisVerticalIcon } from 'lucide-vue-next'
const { member } = defineProps<{
  member: GroupMember
}>()
</script>
<template>
  <div class="flex items-center gap-sm">
    <Avatar :src="member.avatarUrl" :name="member.name" size="lg" />
    <div class="flex flex-col">
      <span class="text-sm font-medium">{{ member.name }}</span>
      <span class="text-xs text-text-muted">{{ member.email }}</span>
    </div>
    <EllipsisVerticalIcon class="ml-auto text-text-muted cursor-pointer" />
  </div>
</template>
