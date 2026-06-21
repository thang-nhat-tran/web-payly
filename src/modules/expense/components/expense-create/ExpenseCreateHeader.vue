<script setup lang="ts">
import AppHeader from '@/shared/components/app/AppHeader.vue'
import Button from '@/shared/components/ui/button/Button.vue'
import { ArrowLeft } from 'lucide-vue-next'

defineProps<{ title: string }>()
defineEmits<{ back: [] }>()
</script>
<template>
  <AppHeader>
    <template #left>
      <Button variant="ghost" size="icon" aria-label="Quay lại" @click="$emit('back')">
        <ArrowLeft :size="24" :strokeWidth="2" />
      </Button>
    </template>
    <template #center>
      <h3>{{ title }}</h3>
    </template>
  </AppHeader>
</template>
