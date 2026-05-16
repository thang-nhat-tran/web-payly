<script setup lang="ts">
import { computed } from 'vue'
import logoSrc from '@/assets/brand/app-logo.png'

type LogoSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl'

const sizeMap: Record<LogoSize, number> = {
  sm: 32,
  md: 48,
  lg: 64,
  xl: 96,
  '2xl': 128,
}

const props = withDefaults(defineProps<{ size?: LogoSize }>(), { size: 'md' })

const px = computed(() => sizeMap[props.size])
</script>

<template>
  <img :src="logoSrc" :width="px" :height="px" alt="Payly" draggable="false" />
</template>
