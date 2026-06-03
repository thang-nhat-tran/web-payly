<script setup lang="ts">
import { computed } from 'vue'
import Spinner from '@/shared/components/ui/Spinner.vue'

type LoaderSize = 'sm' | 'md' | 'lg' | 'xl'

const sizeMap: Record<LoaderSize, string> = {
  sm: '1.6rem',
  md: '2.4rem',
  lg: '3.2rem',
  xl: '4.8rem',
}

const props = withDefaults(
  defineProps<{
    size?: LoaderSize
  }>(),
  { size: 'lg' },
)

const spinnerSize = computed(() => sizeMap[props.size])
</script>

<template>
  <div class="app-loader">
    <Spinner :size="spinnerSize" />
  </div>
</template>

<style scoped>
.app-loader {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  color: var(--color-text-muted);
}
</style>
