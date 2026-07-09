<script setup lang="ts">
import Skeleton from '@/shared/components/ui/Skeleton.vue'
</script>

<template>
  <div class="flex flex-col overflow-hidden rounded-md bg-bg-elevated shadow-sm">
    <div class="p-8">
      <div class="flex items-center gap-4">
        <Skeleton width="52px" height="52px" radius="md" />
        <div class="flex flex-col gap-2">
          <Skeleton width="140px" height="1.5rem" />
          <div class="flex gap-1">
            <Skeleton v-for="i in 3" :key="i" width="24px" height="24px" radius="round" class="skel-avatar" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.skel-avatar + .skel-avatar {
  margin-left: -6px;
}
</style>
