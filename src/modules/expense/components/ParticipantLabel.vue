<script setup lang="ts">
import UserAvatar, { type AvatarSize } from '@/shared/components/ui/Avatar.vue'
import { getFirstWord } from '@/shared/utils/string.util'

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
  <span class="flex min-w-0 items-center gap-4">
    <UserAvatar :name="name" :src="avatarUrl" :size="size" />
    <span class="truncate text-sm font-medium">{{ name ? getFirstWord(name) : 'Unknown' }}</span>
  </span>
</template>
