<script setup lang="ts">
import UserAvatar, { type AvatarSize } from '@/shared/components/ui/Avatar.vue'

withDefaults(
  defineProps<{
    name?: string
    avatarUrl?: string | null
    size?: AvatarSize
  }>(),
  { size: 'sm' },
)
</script>

<template>
  <span class="flex min-w-0 items-center gap-2">
    <UserAvatar :name="name" :src="avatarUrl" :size="size" />
    <span class="truncate text-sm">{{ name }}</span>
  </span>
</template>
