<script setup lang="ts">
import StoryLayout from '../components/StoryLayout.vue'
import StorySection from '../components/StorySection.vue'
import Button, { type ButtonVariant, type ButtonIntent, type ButtonSize } from '@/shared/components/ui/Button.vue'
import Typography from '@/shared/components/ui/typography/Typography.vue'

const variants: ButtonVariant[] = ['solid', 'filled', 'outline', 'ghost']
const colors: ButtonIntent[] = ['primary', 'danger']
const sizes: ButtonSize[] = ['xs', 'sm', 'md', 'lg', 'xl']
</script>

<template>
  <StoryLayout title="Button">
    <StorySection v-for="variant in variants" :key="variant" :title="`variant: ${variant}`">
      <div v-for="color in colors" :key="color" class="flex flex-col gap-xs">
        <Typography size="xs" color="muted" class="uppercase tracking-wide">color: {{ color }}</Typography>
        <div class="flex flex-wrap items-center gap-sm">
          <Button v-for="size in sizes" :key="size" :variant="variant" :color="color" :size="size">
            {{ size }}
          </Button>
        </div>
      </div>
    </StorySection>

    <StorySection title="States">
      <div class="flex flex-wrap items-center gap-sm">
        <Button>Default</Button>
        <Button disabled>Disabled</Button>
        <Button loading>Loading</Button>
        <Button as="a" href="#">as=&quot;a&quot;</Button>
      </div>
    </StorySection>
  </StoryLayout>
</template>
