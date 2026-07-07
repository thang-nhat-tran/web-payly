<script setup lang="ts">
import Skeleton from '@/shared/components/ui/Skeleton.vue'
import ExpenseCardSkeleton from '@/modules/expense/components/expense-card/ExpenseCardSkeleton.vue'
</script>

<template>
  <div class="flex min-h-svh flex-col bg-bg-layout">
    <!-- header: back button / title / menu button -->
    <header
      class="sticky top-0 z-50 grid h-24 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center border-b border-border bg-bg-layout px-sm shadow-sm"
    >
      <Skeleton width="32px" height="32px" radius="round" />
      <Skeleton width="120px" height="1.1rem" />
      <Skeleton width="32px" height="32px" radius="round" class="justify-self-end" />
    </header>

    <!-- content: expense list (default tab) -->
    <Skeleton width="80px" height="1.2rem" class="m-sm" />
    <div class="flex flex-col gap-sm px-sm">
      <ExpenseCardSkeleton v-for="i in 4" :key="i" />
    </div>
  </div>
</template>
