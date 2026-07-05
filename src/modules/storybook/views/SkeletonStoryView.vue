<script setup lang="ts">
import StoryLayout from '../components/StoryLayout.vue'
import StorySection from '../components/StorySection.vue'
import Skeleton from '@/shared/components/ui/Skeleton.vue'
import Typography from '@/shared/components/ui/typography/Typography.vue'

const radii = ['xs', 'sm', 'md', 'lg', 'xl', 'round', 'pill'] as const
</script>

<template>
  <StoryLayout title="Skeleton">
    <StorySection title="Radius">
      <div class="flex flex-col gap-sm">
        <div v-for="radius in radii" :key="radius" class="flex items-center gap-sm">
          <Typography size="xs" color="muted" class="w-12 shrink-0 uppercase">{{ radius }}</Typography>
          <Skeleton width="240px" height="2.4rem" :radius="radius" />
        </div>
      </div>
    </StorySection>

    <StorySection title="Shapes">
      <div class="flex flex-wrap items-center gap-md">
        <Skeleton width="4.8rem" height="4.8rem" radius="round" />
        <Skeleton width="120px" height="1.6rem" radius="pill" />
      </div>
    </StorySection>
  </StoryLayout>
</template>
