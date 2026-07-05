<script setup lang="ts">
import StoryLayout from '../components/StoryLayout.vue'
import StorySection from '../components/StorySection.vue'
import Input from '@/shared/components/ui/Input.vue'
import Typography from '@/shared/components/ui/typography/Typography.vue'

const variants = ['outlined', 'filled', 'borderless'] as const
const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const
const weights = ['normal', 'medium', 'semibold', 'bold'] as const
const aligns = ['left', 'center', 'right'] as const
</script>

<template>
  <StoryLayout title="Input">
    <StorySection v-for="variant in variants" :key="variant" :title="`variant: ${variant}`">
      <div class="flex flex-col gap-sm">
        <div v-for="size in sizes" :key="size" class="flex items-center gap-sm">
          <Typography size="xs" color="muted" class="w-8 shrink-0 uppercase">{{ size }}</Typography>
          <Input :variant="variant" :size="size" :placeholder="`Size ${size}`" class="max-w-xs" />
        </div>
      </div>
    </StorySection>

    <StorySection title="Weight">
      <div class="flex flex-wrap items-center gap-sm">
        <Input v-for="weight in weights" :key="weight" :weight="weight" :placeholder="weight" class="max-w-xs" />
      </div>
    </StorySection>

    <StorySection title="Align">
      <div class="flex flex-wrap items-center gap-sm">
        <Input v-for="align in aligns" :key="align" :align="align" :placeholder="align" class="max-w-xs" />
      </div>
    </StorySection>

    <StorySection title="Error">
      <Input error="This field is required" placeholder="Invalid input" class="max-w-xs" />
    </StorySection>

    <StorySection title="Multiline">
      <Input multiline placeholder="Multiline textarea" class="max-w-xs" />
    </StorySection>
  </StoryLayout>
</template>
