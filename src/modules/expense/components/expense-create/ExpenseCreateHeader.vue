<script setup lang="ts">
import AppHeader from '@/shared/components/app/AppHeader.vue'
import Button from '@/shared/components/ui/Button.vue'
import Typography from '@/shared/components/ui/typography/Typography.vue'
import { X } from 'lucide-vue-next'

defineProps<{ title: string; isSaving?: boolean }>()
defineEmits<{ back: []; save: [] }>()
</script>

<template>
  <AppHeader>
    <template #left>
      <Button variant="ghost" size="xs" aria-label="Quay lại" @click="$emit('back')">
        <X :size="20" :stroke-width="2" />
      </Button>
      <Typography size="md" weight="semibold" class="ml-sm">{{ title }}</Typography>
    </template>
    <template #right>
      <Button variant="solid" size="md" :loading="isSaving" @click="$emit('save')">Lưu</Button>
    </template>
  </AppHeader>
</template>
