<script setup lang="ts">
import { Link } from 'lucide-vue-next'

withDefaults(
  defineProps<{
    title?: string
    description?: string
    actionLabel?: string
  }>(),
  {
    title: 'Link mời vào nhóm!',
    description: 'https://lets-payly.vercel.app/invite/abc123',
    actionLabel: 'Copy',
  },
)

defineEmits<{ action: [] }>()
</script>

<template>
  <div class="flex items-center gap-md rounded-md bg-gray-100 px-sm py-md shadow-sm">
    <div class="min-w-0 flex-1">
      <p class="text-sm font-bold">{{ title }}</p>
      <p v-if="description" class="truncate text-xs text-text-muted">
        {{ description }}
      </p>
    </div>
    <button type="button" class="btn-icon" @click="$emit('action')">
      <Link :size="18" :stroke-width="2.0" />
    </button>
  </div>
</template>
