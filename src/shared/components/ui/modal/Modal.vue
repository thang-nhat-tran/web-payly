<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { onMounted, onUnmounted, provide, type HTMLAttributes } from 'vue'
import { MODAL_CLOSE_KEY } from './context'
import { cn } from '@/shared/utils/cn.util'

const props = defineProps<{
  open: boolean
  /** Consumer classes — tailwind-merged onto the panel (not the backdrop) via cn(). */
  class?: HTMLAttributes['class']
}>()
const emit = defineEmits<{ close: [] }>()

function close() {
  emit('close')
}

// Let descendant pieces (<ModalClose>, etc.) trigger a close.
provide(MODAL_CLOSE_KEY, close)

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape' && props.open) close()
}

onMounted(() => window.addEventListener('keydown', onKey))
onUnmounted(() => window.removeEventListener('keydown', onKey))
</script>

<template>
  <Teleport to="body">
    <Transition name="backdrop">
      <div v-if="open" class="fixed inset-0 z-100 flex items-center justify-center bg-bg-mask p-md" @click.self="close">
        <Transition name="panel" appear>
          <div
            v-if="open"
            role="dialog"
            aria-modal="true"
            :class="cn('w-full max-w-200 overflow-hidden rounded-md bg-bg-layout shadow-lg', props.class)"
          >
            <slot />
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* Backdrop transition */
.backdrop-enter-active,
.backdrop-leave-active {
  transition: opacity 0.2s var(--ease-standard);
}
.backdrop-enter-from,
.backdrop-leave-to {
  opacity: 0;
}

/* Panel transition — fades + lifts into place */
.panel-enter-active,
.panel-leave-active {
  transition:
    opacity 0.22s var(--ease-standard),
    transform 0.22s var(--ease-standard);
}
.panel-enter-from,
.panel-leave-to {
  opacity: 0;
  transform: translateY(24px) scale(0.97);
}
</style>
