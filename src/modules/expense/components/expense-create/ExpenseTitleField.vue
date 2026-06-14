<script setup lang="ts">
import Input from '@/shared/components/ui/Input.vue'
import Label from '@/shared/components/ui/Label.vue'

const title = defineModel<string>({ required: true, default: '' })
</script>

<template>
  <Label>Tên khoản chi</Label>
  <Input
    v-model="title"
    variant="ghost"
    placeholder="Poisidon thượng hạn"
    class="rounded-md bg-bg-surface px-5 py-4 shadow-sm"
  />
  <!-- </div> -->
</template>
