<script setup lang="ts">
import { Toaster } from 'vue-sonner'
import { QueryClient } from './shared/lib/query/core/query-client'
import { provideQueryClient } from './shared/lib/query/vue/useQueryClient'

const toastOptions = {
  style: {
    fontFamily: 'var(--font-sans)',
    fontSize: 'var(--text-xs)',
    borderRadius: 'var(--radius-md)',
    boxShadow: 'var(--shadow-md)',
  },
  classes: {
    description: 'toast-description',
  },
}

const queryClient = new QueryClient()
provideQueryClient(queryClient)
</script>

<template>
  <RouterView />
  <Toaster position="top-right" :duration="3500" rich-colors :toast-options="toastOptions" />
</template>
