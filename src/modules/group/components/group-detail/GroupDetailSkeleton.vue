<script setup lang="ts">
import Skeleton from '@/shared/components/ui/Skeleton.vue'
</script>

<template>
  <div class="skeleton-page">
    <!-- hero -->
    <Skeleton height="200px" border-radius="0" />

    <!-- tab bar -->
    <div class="skeleton-tabs">
      <Skeleton v-for="i in 3" :key="i" width="72px" height="14px" />
    </div>

    <!-- content rows -->
    <div class="skeleton-content">
      <Skeleton v-for="i in 5" :key="i" height="64px" border-radius="var(--radius-md)" />
    </div>
  </div>
</template>

<style scoped>
.skeleton-page {
  min-height: 100svh;
  background-color: var(--color-bg-base);
  display: flex;
  flex-direction: column;
}

.skeleton-tabs {
  display: flex;
  gap: var(--spacing-md);
  padding: var(--spacing-sm) var(--spacing-sm);
  border-bottom: 1px solid var(--color-text-disabled);
}

.skeleton-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm);
}
</style>
