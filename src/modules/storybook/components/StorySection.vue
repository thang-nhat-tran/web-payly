<script setup lang="ts">
import Typography from '@/shared/components/ui/typography/Typography.vue'

defineProps<{
  title: string
}>()
</script>

<template>
  <section class="flex flex-col gap-sm">
    <Typography as="h4" size="md" weight="bold">{{ title }}</Typography>
    <div class="flex flex-col gap-md rounded-md p-md bg-bg-elevated shadow-md">
      <slot />
    </div>
  </section>
</template>
