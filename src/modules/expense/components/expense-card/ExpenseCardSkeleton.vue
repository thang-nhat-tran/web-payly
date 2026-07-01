<script setup lang="ts">
import Skeleton from '@/shared/components/ui/Skeleton.vue'
</script>

<template>
  <div class="flex overflow-hidden rounded-md bg-bg-surface shadow-sm">
    <div class="flex w-full gap-4 p-6">
      <!-- Left: title + "Bạn đã trả" + date -->
      <div class="flex min-w-0 flex-col gap-1">
        <Skeleton width="140px" height="1.1rem" />
        <Skeleton width="60px" height="0.85rem" />
        <Skeleton width="90px" height="0.85rem" />
      </div>

      <!-- Right: amount + avatars/count -->
      <div class="flex flex-1 flex-col items-end justify-center gap-4">
        <Skeleton width="80px" height="1.1rem" />
        <div class="flex items-center gap-3">
          <div class="flex">
            <Skeleton v-for="i in 3" :key="i" width="20px" height="20px" radius="round" class="skel-avatar" />
          </div>
          <Skeleton width="52px" height="0.85rem" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.skel-avatar + .skel-avatar {
  margin-left: -5px;
}
</style>
