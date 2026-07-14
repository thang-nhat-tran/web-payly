<script setup lang="ts">
import { ref } from 'vue'
import StoryLayout from '../components/StoryLayout.vue'
import StorySection from '../components/StorySection.vue'
import { Upload } from '@/shared/components/ui/upload'
import Typography from '@/shared/components/ui/typography/Typography.vue'

/** Fakes network latency + progress reporting so the story needs no real bucket. */
function simulateProgress(onProgress?: (percent: number) => void, stepMs = 150): Promise<void> {
  return new Promise((resolve) => {
    let progress = 0
    const interval = setInterval(() => {
      progress += 25
      onProgress?.(Math.min(progress, 100))
      if (progress >= 100) {
        clearInterval(interval)
        resolve()
      }
    }, stepMs)
  })
}

function mockUpload(file: File, onProgress?: (percent: number) => void): Promise<string> {
  return simulateProgress(onProgress).then(() => URL.createObjectURL(file))
}

// Fails the first attempt per file, then succeeds on retry — demonstrates the error + "Thử lại" flow.
const failedOnce = new WeakSet<File>()
function flakyUpload(file: File, onProgress?: (percent: number) => void): Promise<string> {
  return simulateProgress(onProgress).then(() => {
    if (!failedOnce.has(file)) {
      failedOnce.add(file)
      throw new Error('Simulated upload failure — click "Thử lại" to retry')
    }
    return URL.createObjectURL(file)
  })
}

const basicPaths = ref<string[]>([])
const limitedPaths = ref<string[]>([])
const flakyPaths = ref<string[]>([])
</script>

<template>
  <StoryLayout title="Upload">
    <StorySection title="Basic (multiple images)">
      <Upload v-model:paths="basicPaths" :upload-fn="mockUpload" />
      <Typography size="xs" color="muted">Uploaded paths: {{ basicPaths.length }}</Typography>
    </StorySection>

    <StorySection title="Max 3 files">
      <Upload v-model:paths="limitedPaths" :upload-fn="mockUpload" :max-files="3" />
    </StorySection>

    <StorySection title="Error + retry">
      <Upload v-model:paths="flakyPaths" :upload-fn="flakyUpload" />
    </StorySection>

    <StorySection title="Disabled">
      <Upload :upload-fn="mockUpload" disabled />
    </StorySection>
  </StoryLayout>
</template>
