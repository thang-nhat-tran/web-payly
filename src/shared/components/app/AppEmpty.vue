<script setup lang="ts">
import { computed } from 'vue'
import logoSrc from '@/assets/brand/app-empty.png'

type LogoSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl'

const sizeMap: Record<LogoSize, number> = {
  sm: 64,
  md: 96,
  lg: 128,
  xl: 192,
  '2xl': 256,
}

const props = withDefaults(defineProps<{ size?: LogoSize }>(), { size: 'md' })

const px = computed(() => sizeMap[props.size])
</script>

<template>
  <img :src="logoSrc" :width="px" :height="px" alt="Payly Empty" draggable="false" />
</template>
