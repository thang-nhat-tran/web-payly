<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/shared/utils/cn.util'
import type { MenuItemProps } from './menu.type'

const props = withDefaults(defineProps<MenuItemProps>(), {
  disabled: false,
  danger: false,
  class: '',
})

const emit = defineEmits<{ click: [key: string] }>()

function onClick() {
  if (props.item.disabled) return
  emit('click', props.item.key)
}

const itemClass = computed(() =>
  cn(
    'flex w-full items-center gap-2 rounded-sm p-sm text-text-secondary',
    props.variant === 'elevated' ? 'bg-bg-elevated' : 'bg-transparent',
    props.item.danger && 'text-error hover:bg-error-hover',
    props.selected && !props.item.danger && 'bg-bg-active font-semibold text-text',
    props.selected && props.item.danger && 'bg-danger bg-error-foreground font-semibold',
    props.class,
  ),
)
</script>

<template>
  <button :as="'span'" :class="itemClass" :disabled="props.item.disabled" @click="onClick">
    <component :is="props.item.icon" v-if="props.item.icon" :size="20" :stroke-width="props.selected ? 2 : 1" />
    <span v-if="props.item.label" class="truncate leading-none">{{ props.item.label }}</span>
  </button>
</template>
