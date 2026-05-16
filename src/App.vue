<script setup lang="ts">
import { Toaster } from 'vue-sonner'

const toastOptions = {
  style: {
    fontFamily:   'var(--font-sans)',
    fontSize:     'var(--text-sm)',
    borderRadius: 'var(--radius-cta)',
    boxShadow:    'var(--shadow-card)',
    border:       '1.5px solid var(--color-dust)',
    background:   'var(--color-surface-white)',
    color:        'var(--color-ink)',
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
