<script setup lang="ts">
import { Toaster } from 'vue-sonner'

const toastOptions = {
  style: {
    fontFamily:   'var(--font-sans)',
    fontSize:     'var(--text-xs)',
    borderRadius: 'var(--radius-md)',
    boxShadow:    'var(--shadow-md)',
    border:       '1.5px solid var(--color-text-disabled)',
    background:   'var(--color-bg-surface)',
    color:        'var(--color-text-main)',
  },
  classes: {
    description: 'toast-description',
  },
}
</script>

<template>
  <RouterView />
  <Toaster position="top-right" :duration="3500" rich-colors :toast-options="toastOptions" />
</template>
