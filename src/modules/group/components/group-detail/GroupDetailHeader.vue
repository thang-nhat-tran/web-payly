<script setup lang="ts">
import AppHeader from '@/shared/components/app/AppHeader.vue'
import Button from '@/shared/components/ui/Button.vue'
import Typography from '@/shared/components/ui/typography/Typography.vue'
import { ArrowLeft, MenuIcon } from 'lucide-vue-next'

defineProps<{
  name: string
}>()

defineEmits<{ back: []; openSidebar: [] }>()
</script>

<template>
  <AppHeader>
    <template #left>
      <Button variant="ghost" @click="$emit('back')">
        <ArrowLeft :size="20" :stroke-width="2" />
      </Button>
    </template>
    <template #center>
      <Typography size="md" weight="semibold">
        {{ name }}
      </Typography>
    </template>
    <template #right>
      <Button variant="ghost" @click="$emit('openSidebar')">
        <MenuIcon :size="20" :stroke-width="2" />
      </Button>
    </template>
  </AppHeader>
</template>
