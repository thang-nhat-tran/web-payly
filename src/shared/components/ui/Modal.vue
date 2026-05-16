<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { X } from 'lucide-vue-next'

const props = defineProps<{ open: boolean; title?: string }>()
const emit = defineEmits<{ close: [] }>()

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape' && props.open) emit('close')
}

onMounted(() => window.addEventListener('keydown', onKey))
onUnmounted(() => window.removeEventListener('keydown', onKey))
</script>

<template>
  <Teleport to="body">
    <Transition name="backdrop">
      <div v-if="open" class="backdrop" @click.self="emit('close')">
        <Transition name="panel" appear>
          <div v-if="open" class="panel" role="dialog" aria-modal="true">
            <!-- Header -->
            <div class="modal-header">
              <span class="modal-title">{{ title }}</span>
              <button class="close-btn" aria-label="Đóng" @click="emit('close')">
                <X :size="18" :stroke-width="2" />
              </button>
            </div>

            <!-- Body -->
            <div class="modal-body">
              <slot />
            </div>

            <!-- Footer -->
            <div v-if="$slots.footer" class="modal-footer">
              <slot name="footer" />
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.backdrop {
  position: fixed;
  inset: 0;
  background-color: rgba(20, 20, 19, 0.48);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: var(--spacing-3);
}

@media (min-width: 768px) {
  .backdrop {
    align-items: center;
  }
}

.panel {
  background-color: var(--color-surface-white);
  border-radius: var(--radius-hero);
  box-shadow: var(--shadow-feature);
  width: 100%;
  max-width: 480px;
  overflow: hidden;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-3) var(--spacing-4);
}

.modal-title {
  font-size: var(--text-h3);
  font-weight: 500;
  letter-spacing: var(--tracking-headline);
  color: var(--color-ink);
}

.close-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: var(--radius-circle);
  border: none;
  background-color: var(--color-canvas);
  color: var(--color-slate);
  cursor: pointer;
  transition: opacity 0.15s var(--ease-standard);
  flex-shrink: 0;
}
.close-btn:hover {
  opacity: 0.72;
}

.modal-body {
  padding: 0 var(--spacing-3);
}

.modal-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: var(--spacing-1);
  padding: var(--spacing-2) var(--spacing-4);
}

/* Backdrop transition */
.backdrop-enter-active,
.backdrop-leave-active {
  transition: opacity 0.2s var(--ease-standard);
}
.backdrop-enter-from,
.backdrop-leave-to {
  opacity: 0;
}

/* Panel transition — slides up from bottom on mobile, scales on desktop */
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
