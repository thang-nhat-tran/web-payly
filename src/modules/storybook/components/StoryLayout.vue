<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ArrowLeft } from 'lucide-vue-next'
import AppHeader from '@/shared/components/app/AppHeader.vue'

defineProps<{
  title: string
}>()

const router = useRouter()
</script>

<template>
  <div class="min-h-screen pb-3xl">
    <AppHeader class="border-b border-text-secondary px-sm">
      <template #left>
        <button class="flex items-center gap-xs" @click="router.push('/storybook')">
          <ArrowLeft :size="20" />
        </button>
      </template>
      <template #center>
        <h3>{{ title }}</h3>
      </template>
    </AppHeader>

    <main class="flex flex-col gap-xl px-sm py-lg">
      <slot />
    </main>
  </div>
</template>
