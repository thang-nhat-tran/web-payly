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
  <div class="flex items-center gap-3 rounded-cta bg-gray-100 px-2 py-3 shadow-card">
    <div class="min-w-0 flex-1">
      <p class="text-md font-medium">{{ title }}</p>
      <p v-if="description" class="truncate text-sm text-slate">
        {{ description }}
      </p>
    </div>
    <button type="button" class="btn-primary px-2 text-md" @click="$emit('action')">
      <Link :size="18" :stroke-width="1.5" />
    </button>
  </div>
</template>
