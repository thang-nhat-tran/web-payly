<script setup lang="ts">
import StoryLayout from '../components/StoryLayout.vue'
import StorySection from '../components/StorySection.vue'
import Typography from '@/shared/components/ui/typography/Typography.vue'

const tags = ['p', 'span', 'div', 'label', 'strong', 'small', 'h1', 'h2', 'h3', 'h4'] as const
const sizes = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'] as const
const weights = ['regular', 'medium', 'semibold', 'bold'] as const
const colors = ['main', 'muted', 'disabled', 'danger', 'success', 'inherit'] as const
const aligns = ['left', 'center', 'right'] as const
</script>

<template>
  <StoryLayout title="Typography">
    <StorySection title="as">
      <div class="flex flex-col gap-xs">
        <Typography v-for="tag in tags" :key="tag" :as="tag" size="sm">{{ tag }} — The quick brown fox</Typography>
      </div>
    </StorySection>

    <StorySection title="Size">
      <div class="flex flex-col gap-xs">
        <Typography v-for="size in sizes" :key="size" :size="size">{{ size }} — The quick brown fox</Typography>
      </div>
    </StorySection>

    <StorySection title="Weight">
      <div class="flex flex-col gap-xs">
        <Typography v-for="weight in weights" :key="weight" :weight="weight" size="lg">
          {{ weight }} — The quick brown fox
        </Typography>
      </div>
    </StorySection>

    <StorySection title="Color">
      <div class="flex flex-col gap-xs">
        <Typography v-for="color in colors" :key="color" :color="color" size="lg">
          {{ color }} — The quick brown fox
        </Typography>
      </div>
    </StorySection>

    <StorySection title="Align">
      <div class="flex flex-col gap-xs">
        <Typography v-for="align in aligns" :key="align" :align="align" size="sm" class="w-full">
          {{ align }} — The quick brown fox
        </Typography>
      </div>
    </StorySection>

    <StorySection title="Truncate & line-clamp">
      <div class="flex max-w-xs flex-col gap-sm">
        <Typography truncate size="sm">
          Truncated: The quick brown fox jumps over the lazy dog and keeps running forever.
        </Typography>
        <Typography :line-clamp="2" size="sm">
          Line-clamp 2: The quick brown fox jumps over the lazy dog and keeps running forever through the meadow without
          stopping for a rest.
        </Typography>
      </div>
    </StorySection>
  </StoryLayout>
</template>
