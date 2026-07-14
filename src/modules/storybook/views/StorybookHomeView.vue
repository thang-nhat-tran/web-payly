<script setup lang="ts">
import { useRouter } from 'vue-router'
import Typography from '@/shared/components/ui/typography/Typography.vue'

const router = useRouter()

const pages = [
  { to: '/storybook/button', label: 'Button', description: 'Variants, colors, sizes, and states' },
  { to: '/storybook/input', label: 'Input', description: 'Variants, sizes, weights, alignment, and error state' },
  { to: '/storybook/label', label: 'Label', description: 'Required and optional markers' },
  { to: '/storybook/skeleton', label: 'Skeleton', description: 'Radius scale' },
  { to: '/storybook/typography', label: 'Typography', description: 'Tags, sizes, weights, colors, and alignment' },
  { to: '/storybook/menu', label: 'Menu', description: 'Selectable items, groups, dividers, and horizontal mode' },
  { to: '/storybook/dropdown', label: 'Dropdown', description: 'Placements, selection, and disabled state' },
  { to: '/storybook/upload', label: 'Upload', description: 'Preview, progress, error/retry, and multi-file limits' },
]
</script>

<template>
  <div class="min-h-screen px-sm py-lg">
    <Typography as="h1" size="2xl" weight="bold">Storybook</Typography>
    <Typography size="sm" color="muted" class="mt-1 mb-lg">Visual reference for shared UI components.</Typography>

    <div class="flex flex-col gap-sm">
      <button
        v-for="page in pages"
        :key="page.to"
        class="flex flex-col items-start gap-xs rounded-md bg-bg-elevated p-md text-left shadow-sm transition-shadow duration-150 ease-standard hover:shadow-md"
        @click="router.push(page.to)"
      >
        <Typography as="h3" size="lg" weight="semibold">{{ page.label }}</Typography>
        <Typography size="sm" color="muted">{{ page.description }}</Typography>
      </button>
    </div>
  </div>
</template>
