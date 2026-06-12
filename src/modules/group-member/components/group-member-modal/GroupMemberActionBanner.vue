<script setup lang="ts">
import { Link } from 'lucide-vue-next'
import Button from '@/shared/components/ui/Button.vue'

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
  <div class="flex items-center gap-md rounded-md bg-bg-soft px-sm py-md shadow-sm">
    <div class="min-w-0 flex-1">
      <p class="text-sm font-bold">{{ title }}</p>
      <p v-if="description" class="truncate text-xs text-text-muted">
        {{ description }}
      </p>
    </div>
    <Button variant="icon" @click="$emit('action')">
      <Link :size="18" :stroke-width="2.0" />
    </Button>
  </div>
</template>
