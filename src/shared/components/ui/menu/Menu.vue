<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/shared/utils/cn.util'
import type { MenuProps } from './menu.type'
import { MenuItem } from '.'

const props = withDefaults(defineProps<MenuProps>(), {
  mode: 'vertical',
  variant: 'elevated',
  selectable: true,
  multiple: false,
})

const selectedKeys = defineModel<string[]>('selectedKeys', { default: () => [] })

function select(key: string) {
  if (!props.selectable) return

  if (props.multiple) {
    const index = selectedKeys.value.indexOf(key)
    if (index === -1) {
      selectedKeys.value.push(key)
    } else {
      selectedKeys.value.splice(index, 1)
    }
  } else {
    selectedKeys.value = [key]
  }
}

const menuClass = computed(() =>
  cn(
    'flex gap-1 p-sm',
    props.variant === 'elevated' ? 'bg-bg-elevated' : 'bg-transparent',
    props.mode === 'horizontal' ? 'flex-row items-center' : 'flex-col',
    props.class,
  ),
)
</script>

<template>
  <div :class="menuClass">
    <MenuItem
      v-for="item in props.items"
      v-bind:item="item"
      :variant="props.variant"
      :key="item.key"
      :selected="selectedKeys.includes(item.key)"
      @click="select"
    />
  </div>
</template>
