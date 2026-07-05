<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { computed, onBeforeUnmount, watch, useSlots } from 'vue'
import { cn } from '@/shared/utils/cn.util'

type DrawerPlacement = 'left' | 'right' | 'top' | 'bottom'
type DrawerSize = 'small' | 'medium' | 'large' | string | number

const props = withDefaults(
  defineProps<{
    title?: string
    placement?: DrawerPlacement
    size?: DrawerSize

    mask?: boolean
    maskClosable?: boolean
    closable?: boolean
    keyboard?: boolean
    zIndex?: number
  }>(),
  {
    placement: 'right',
    size: 'small',
    mask: true,
    maskClosable: true,
    closable: true,
    keyboard: true,
    zIndex: 1000,
  },
)

const open = defineModel<boolean>('open', { default: false })

const emit = defineEmits<{
  close: []
  afterOpenChange: [open: boolean]
}>()

const slots = useSlots()

const hasHeader = computed(() => {
  return Boolean(props.title || slots.title || slots.extra || props.closable)
})

const hasFooter = computed(() => Boolean(slots.footer))

const resolvedSize = computed(() => {
  if (typeof props.size === 'number') return `${props.size}px`
  if (props.size === 'large') return '736px'
  if (props.size === 'medium') return '378px'
  if (props.size === 'small') return '268px'
  return props.size
})

const panelStyle = computed(() => {
  const size = resolvedSize.value

  if (props.placement === 'left' || props.placement === 'right') {
    return {
      width: size,
      maxWidth: '100vw',
    }
  }

  return {
    height: size,
    maxHeight: '100vh',
  }
})

const wrapperClass = computed(() =>
  cn(
    'pointer-events-none absolute inset-0 flex',
    props.placement === 'right' && 'justify-end',
    props.placement === 'left' && 'justify-start',
    props.placement === 'top' && 'items-start',
    props.placement === 'bottom' && 'items-end',
  ),
)

const panelClass = computed(() =>
  cn(
    'relative flex bg-bg-layout text-text shadow-xl',
    'pointer-events-auto',

    props.placement === 'left' || props.placement === 'right' ? 'h-full flex-col' : 'w-full flex-col',
  ),
)

const transitionName = computed(() => `drawer-slide-${props.placement}`)

function closeDrawer() {
  open.value = false
  emit('close')
}

function handleMaskClick() {
  if (!props.maskClosable) return
  closeDrawer()
}

function handleKeydown(event: KeyboardEvent) {
  if (!props.keyboard) return
  if (event.key !== 'Escape') return
  if (!open.value) return

  closeDrawer()
}

watch(
  open,
  (value) => {
    document.body.style.overflow = value ? 'hidden' : ''
  },
  { immediate: true },
)

window.addEventListener('keydown', handleKeydown)

onBeforeUnmount(() => {
  document.body.style.overflow = ''
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="fixed inset-0" :style="{ zIndex }">
      <Transition name="drawer-fade">
        <div v-if="mask" class="absolute inset-0 bg-black/45" @click="handleMaskClick" />
      </Transition>

      <div :class="wrapperClass">
        <Transition
          :name="transitionName"
          appear
          @after-enter="emit('afterOpenChange', true)"
          @after-leave="emit('afterOpenChange', false)"
        >
          <section v-if="open" :class="panelClass" :style="panelStyle" role="dialog" aria-modal="true">
            <header v-if="hasHeader" class="border-b border-border">
              <slot name="header" />
            </header>

            <main class="min-h-0 flex-1 overflow-auto">
              <slot />
            </main>

            <footer v-if="hasFooter" class="border-t border-border">
              <slot name="footer" />
            </footer>
          </section>
        </Transition>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.drawer-fade-enter-active,
.drawer-fade-leave-active {
  transition: opacity 0.2s ease;
}

.drawer-fade-enter-from,
.drawer-fade-leave-to {
  opacity: 0;
}

.drawer-slide-right-enter-active,
.drawer-slide-right-leave-active,
.drawer-slide-left-enter-active,
.drawer-slide-left-leave-active,
.drawer-slide-top-enter-active,
.drawer-slide-top-leave-active,
.drawer-slide-bottom-enter-active,
.drawer-slide-bottom-leave-active {
  transition: transform 0.25s ease;
}

.drawer-slide-right-enter-from,
.drawer-slide-right-leave-to {
  transform: translateX(100%);
}

.drawer-slide-left-enter-from,
.drawer-slide-left-leave-to {
  transform: translateX(-100%);
}

.drawer-slide-top-enter-from,
.drawer-slide-top-leave-to {
  transform: translateY(-100%);
}

.drawer-slide-bottom-enter-from,
.drawer-slide-bottom-leave-to {
  transform: translateY(100%);
}
</style>
