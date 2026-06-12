<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { computed } from 'vue'
import { useMergedAttrs } from '@/shared/composables/useMergedAttrs'

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'

const sizeMap: Record<AvatarSize, string> = {
  xs: 'w-8 h-8 text-xs',
  sm: 'w-12 h-12 text-xs',
  md: 'w-16 h-16 text-xs',
  lg: 'w-20 h-20 text-sm',
  xl: 'w-24 h-24 text-lg',
  '2xl': 'w-28 h-28 text-xl',
}

const props = withDefaults(
  defineProps<{
    src?: string
    name?: string
    size?: AvatarSize
  }>(),
  { size: 'md' },
)

const fallback = computed(() => (props.name?.[0] ?? '?').toUpperCase())

defineOptions({ inheritAttrs: false })
const { rootClass, attrs } = useMergedAttrs(() => [
  'portrait shrink-0 overflow-hidden bg-bg-soft flex items-center justify-center rounded-full',
  sizeMap[props.size],
])
</script>

<template>
  <div :class="rootClass" v-bind="attrs">
    <img v-if="src" :src="src" :alt="name" class="w-full h-full object-cover" />
    <span v-else class="font-medium text-text-main">{{ fallback }}</span>
  </div>
</template>
