<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { ref, computed, type HTMLAttributes } from 'vue'
import { cn } from '@/shared/utils/cn.util'

const props = withDefaults(
  defineProps<{
    text?: string
    placement?: 'top' | 'bottom' | 'left' | 'right'
    /** External control (e.g. force-show when a disabled-looking trigger is tapped). */
    open?: boolean
    class?: HTMLAttributes['class']
  }>(),
  { placement: 'top' },
)
const emit = defineEmits<{ 'update:open': [boolean] }>()

const internalOpen = ref(false)
const isOpen = computed({
  get: () => props.open ?? internalOpen.value,
  set: (v: boolean) => {
    internalOpen.value = v
    emit('update:open', v)
  },
})

let hideTimer: ReturnType<typeof setTimeout> | undefined
function show() {
  if (hideTimer) clearTimeout(hideTimer)
  isOpen.value = true
}
function scheduleHide() {
  hideTimer = setTimeout(() => (isOpen.value = false), 120)
}
/** Touch devices have no hover — tapping the trigger toggles the tooltip instead. */
function toggleOnTap() {
  isOpen.value = !isOpen.value
}

const placementClass: Record<string, string> = {
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-xs',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-xs',
  left: 'right-full top-1/2 -translate-y-1/2 mr-xs',
  right: 'left-full top-1/2 -translate-y-1/2 ml-xs',
}
</script>

<template>
  <span
    class="relative inline-flex"
    @mouseenter="show"
    @mouseleave="scheduleHide"
    @focusin="show"
    @focusout="scheduleHide"
    @click="toggleOnTap"
  >
    <slot />
    <Transition name="tooltip-fade">
      <span
        v-if="isOpen"
        role="tooltip"
        :class="
          cn(
            'pointer-events-none absolute z-50 whitespace-nowrap rounded-xs bg-text px-3 py-1 text-xs text-primary-foreground shadow-md',
            placementClass[placement],
            props.class,
          )
        "
      >
        <slot name="content">{{ text }}</slot>
      </span>
    </Transition>
  </span>
</template>

<style scoped>
.tooltip-fade-enter-active,
.tooltip-fade-leave-active {
  transition:
    opacity 0.12s var(--ease-standard),
    transform 0.12s var(--ease-standard);
}
.tooltip-fade-enter-from,
.tooltip-fade-leave-to {
  opacity: 0;
  transform: translateY(2px);
}
</style>
