<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { computed } from 'vue'

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

const sizeMap: Record<AvatarSize, string> = {
  xs: 'w-4 h-4 text-xs',
  sm: 'w-6 h-6 text-xs',
  md: 'w-8 h-8 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg',
}

const props = withDefaults(
  defineProps<{
    src?: string
    name?: string
    size?: AvatarSize
  }>(),
  { size: 'md' },
)

const sizeClass = computed(() => sizeMap[props.size])
const fallback = computed(() => (props.name?.[0] ?? '?').toUpperCase())
</script>

<template>
  <div class="portrait shrink-0 overflow-hidden bg-surface-soft flex items-center justify-center" :class="sizeClass">
    <img v-if="src" :src="src" :alt="name" class="w-full h-full object-cover" />
    <span v-else class="font-medium text-ink">{{ fallback }}</span>
  </div>
</template>
