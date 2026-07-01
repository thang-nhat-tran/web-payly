<script setup lang="ts">
import Skeleton from '@/shared/components/ui/Skeleton.vue'
</script>

<template>
  <div class="flex overflow-hidden rounded-md bg-bg-surface shadow-sm">
    <div class="flex w-full gap-4 p-6">
      <!-- Left: avatar + title/date, then "X đã trả cho bạn" -->
      <div class="flex min-w-0 flex-1 flex-col items-start gap-2">
        <div class="flex min-w-0 w-full items-center gap-3">
          <Skeleton width="36px" height="36px" radius="round" />
          <div class="flex min-w-0 flex-1 flex-col gap-1">
            <Skeleton width="120px" height="1rem" />
            <Skeleton width="80px" height="0.85rem" />
          </div>
        </div>
        <div class="flex items-center gap-1">
          <Skeleton width="50px" height="0.85rem" />
          <Skeleton width="85px" height="0.85rem" />
        </div>
      </div>

      <!-- Right: amount -->
      <div class="flex shrink-0 flex-col items-end justify-center">
        <Skeleton width="80px" height="1.1rem" />
      </div>
    </div>
  </div>
</template>
