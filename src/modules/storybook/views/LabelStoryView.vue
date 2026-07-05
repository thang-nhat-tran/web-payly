<script setup lang="ts">
import StoryLayout from '../components/StoryLayout.vue'
import StorySection from '../components/StorySection.vue'
import Label from '@/shared/components/ui/Label.vue'
</script>

<template>
  <StoryLayout title="Label">
    <StorySection title="Default">
      <Label>Field label</Label>
    </StorySection>

    <StorySection title="required">
      <Label required>Field label</Label>
    </StorySection>

    <StorySection title="optional">
      <Label optional>Field label</Label>
    </StorySection>
  </StoryLayout>
</template>
