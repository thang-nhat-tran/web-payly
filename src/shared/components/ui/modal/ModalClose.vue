<script setup lang="ts">
import { inject } from 'vue'
import { X } from 'lucide-vue-next'
import { MODAL_CLOSE_KEY } from './context'
import { useMergedAttrs } from '@/shared/composables/useMergedAttrs'

// Falls back to a no-op when used outside <Modal>.
const close = inject(MODAL_CLOSE_KEY, () => {})

defineOptions({ inheritAttrs: false })
const { rootClass, attrs } = useMergedAttrs(
  'flex h-[32px] w-[32px] shrink-0 cursor-pointer items-center justify-center rounded-round border-0 bg-bg-base text-text-muted transition-opacity duration-150 ease-standard hover:opacity-[0.72]',
)
</script>

<template>
  <button type="button" aria-label="Đóng" :class="rootClass" v-bind="attrs" @click="close()">
    <slot>
      <X :size="18" :stroke-width="2" />
    </slot>
  </button>
</template>
