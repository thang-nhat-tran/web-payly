<script setup lang="ts">
import AppHeader from '@/shared/components/app/AppHeader.vue'
import Button from '@/shared/components/ui/button/Button.vue'
import { X } from 'lucide-vue-next'

defineProps<{ title: string; isSaving?: boolean }>()
defineEmits<{ back: []; save: [] }>()
</script>

<template>
  <AppHeader>
    <template #left>
      <Button variant="ghost" size="icon" aria-label="Quay lại" @click="$emit('back')">
        <X :size="20" :stroke-width="2" />
      </Button>
      <h3>{{ title }}</h3>
    </template>
    <template #right>
      <Button variant="default" size="md" :loading="isSaving" @click="$emit('save')">Lưu</Button>
    </template>
  </AppHeader>
</template>
