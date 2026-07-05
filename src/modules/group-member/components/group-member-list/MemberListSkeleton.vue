<script setup lang="ts">
import Skeleton from '@/shared/components/ui/Skeleton.vue'

withDefaults(defineProps<{ count?: number }>(), { count: 3 })
</script>

<template>
  <div v-for="i in count" :key="i" class="mb-sm flex items-center gap-sm">
    <Skeleton width="5rem" height="5rem" border-radius="var(--radius-round)" />
    <div class="flex flex-1 flex-col gap-xs">
      <Skeleton width="40%" height="1.6rem" />
      <Skeleton width="60%" height="1.4rem" />
    </div>
  </div>
</template>
