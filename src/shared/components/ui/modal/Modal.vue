<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { onMounted, onUnmounted, provide } from 'vue'
import { MODAL_CLOSE_KEY } from './context'
import { useMergedAttrs } from '@/shared/composables/useMergedAttrs'

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{ close: [] }>()

// Consumer-injected classes land on the panel, not the backdrop.
defineOptions({ inheritAttrs: false })
const { rootClass, attrs } = useMergedAttrs('w-full max-w-200 overflow-hidden rounded-md bg-bg-surface shadow-lg')

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
      <div
        v-if="open"
        class="fixed inset-0 z-100 flex items-center justify-center bg-[rgba(20,20,19,0.48)] p-md"
        @click.self="close"
      >
        <Transition name="panel" appear>
          <div v-if="open" role="dialog" aria-modal="true" :class="rootClass" v-bind="attrs">
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
