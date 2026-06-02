<script setup lang="ts">
import { Toaster } from 'vue-sonner'

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
</script>

<template>
  <RouterView />
  <Toaster position="top-right" :duration="30500" rich-colors :toast-options="toastOptions" />
</template>
