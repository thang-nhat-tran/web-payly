<script setup lang="ts">
import { ref } from 'vue'
import { Pencil, Copy, Trash2, Home, Users, User } from 'lucide-vue-next'
import StoryLayout from '../components/StoryLayout.vue'
import StorySection from '../components/StorySection.vue'
import { Menu } from '@/shared/components/ui/menu'
import type { Item } from '@/shared/components/ui/menu/menu.type'

const actionSelected = ref<string[]>([])
const singleSelected = ref<string[]>(['edit'])
const multiSelected = ref<string[]>(['bold', 'italic'])
const horizontalSelected = ref<string[]>(['home'])

const actionItems: Item[] = [
  { key: 'edit', label: 'Edit', icon: Pencil },
  { key: 'duplicate', label: 'Duplicate', icon: Copy },
  { key: 'delete', label: 'Delete', icon: Trash2, danger: true },
]

const singleSelectItems: Item[] = [
  { key: 'edit', label: 'Edit' },
  { key: 'view', label: 'View only' },
  { key: 'disabled', label: 'Disabled item', disabled: true },
]

const multiSelectItems: Item[] = [
  { key: 'bold', label: 'Bold' },
  { key: 'italic', label: 'Italic' },
  { key: 'underline', label: 'Underline' },
]

const horizontalItems: Item[] = [
  { key: 'home', label: 'Home', icon: Home },
  { key: 'groups', label: 'Groups', icon: Users },
  { key: 'profile', label: 'Profile', icon: User },
]

function logSelect(key: string) {
  console.log('selected', key)
}
</script>

<template>
  <StoryLayout title="Menu">
    <StorySection title="Basic (items array)">
      <Menu v-model:selected-keys="actionSelected" :items="actionItems" class="w-full" @select="logSelect" />
    </StorySection>

    <StorySection title="Selectable (single)">
      <Menu v-model:selected-keys="singleSelected" :items="singleSelectItems" class="w-full" />
      <p class="mt-2 text-xs text-text-tertiary">selectedKeys: {{ singleSelected }}</p>
    </StorySection>

    <StorySection title="Selectable (multiple)">
      <Menu v-model:selected-keys="multiSelected" :items="multiSelectItems" multiple class="w-full" />
      <p class="mt-2 text-xs text-text-tertiary">selectedKeys: {{ multiSelected }}</p>
    </StorySection>

    <StorySection title="Horizontal mode">
      <Menu v-model:selected-keys="horizontalSelected" :items="horizontalItems" mode="horizontal" />
    </StorySection>
  </StoryLayout>
</template>
