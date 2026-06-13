<script setup lang="ts">
import { computed } from 'vue'
import UserAvatar, { type AvatarSize } from '@/shared/components/ui/Avatar.vue'

const props = withDefaults(
  defineProps<{
    avatarUrls: string[]
    max?: number
    size?: AvatarSize
  }>(),
  { max: 4, size: 'sm' },
)

const visibleUrls = computed(() => props.avatarUrls.slice(0, props.max))
const extraCount = computed(() => Math.max(0, props.avatarUrls.length - props.max))
</script>

<template>
  <div class="avatar-stack">
    <div v-for="(url, i) in visibleUrls" :key="i" class="avatar-ring">
      <UserAvatar :src="url" :size="props.size" />
    </div>
    <div v-if="extraCount > 0" class="avatar-ring avatar-extra">+{{ extraCount }}</div>
  </div>
</template>

<style scoped>
.avatar-stack {
  display: flex;
  align-items: center;
}

.avatar-ring {
  border-radius: var(--radius-round);
  border: 2px solid var(--color-bg-surface);
  flex-shrink: 0;
}

.avatar-ring + .avatar-ring {
  margin-left: -8px;
}

.avatar-extra {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background-color: var(--color-bg-base);
  color: var(--color-text-muted);
  font-size: 1.1rem;
  font-weight: 600;
}
</style>
