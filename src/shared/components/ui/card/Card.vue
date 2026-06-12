<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { useMergedAttrs } from '@/shared/composables/useMergedAttrs'

const props = withDefaults(defineProps<{ clickable?: boolean }>(), { clickable: false })

defineOptions({ inheritAttrs: false })
const { rootClass, attrs } = useMergedAttrs(() => [
  'flex flex-col overflow-hidden rounded-md bg-bg-surface shadow-md',
  props.clickable &&
    'cursor-pointer transition-[transform,box-shadow] duration-150 ease-standard hover:-translate-y-[2px] hover:shadow-lg active:scale-[0.98]',
])
</script>

<template>
  <div :class="rootClass" v-bind="attrs">
    <slot />
  </div>
</template>
