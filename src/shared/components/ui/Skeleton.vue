<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div :class="rootClass" :style="{ width, height, borderRadius: radiusValue }" v-bind="attrs" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useMergedAttrs } from '@/shared/composables/useMergedAttrs'

type SkeletonRadius = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'round' | 'pill'

const props = withDefaults(
  defineProps<{
    width?: string
    height?: string
    radius?: SkeletonRadius
  }>(),
  {
    width: '100%',
    height: '1.6rem',
    radius: 'sm',
  },
)

defineOptions({ inheritAttrs: false })
const { rootClass, attrs } = useMergedAttrs('skeleton')

const radiusValue = computed(() => `var(--radius-${props.radius})`)
</script>

<style scoped>
@layer components {
  .skeleton {
    background: linear-gradient(
      90deg,
      var(--color-text-disabled) 25%,
      var(--color-bg-soft) 50%,
      var(--color-text-disabled) 75%
    );
    background-size: 200% 100%;
    animation: shimmer 1.6s ease-in-out infinite;
    flex-shrink: 0;
  }
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>
