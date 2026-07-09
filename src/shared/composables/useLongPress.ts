import { ref, onBeforeUnmount } from 'vue'

export interface UseLongPressOptions {
  /** Ms to hold before firing onLongPress. Default 500. */
  threshold?: number
  /** Max pointer movement (px) before the press is cancelled (treated as scroll/drag). Default 10. */
  moveTolerance?: number
  onLongPress: (event: PointerEvent) => void
  /** Fired on pointerup if long-press did NOT fire — i.e. a normal tap. */
  onClick?: (event: PointerEvent) => void
}

/**
 * Detects a press-and-hold on an element via Pointer Events, distinct from a
 * tap/click and cancelled by scrolling/dragging. Bind `handlers` on the
 * target element instead of `@click`.
 */
export function useLongPress(options: UseLongPressOptions) {
  const isLongPressed = ref(false)
  let timer: ReturnType<typeof setTimeout> | undefined
  let startX = 0
  let startY = 0

  function clearTimer() {
    if (timer) clearTimeout(timer)
    timer = undefined
  }

  function onPointerdown(e: PointerEvent) {
    if (e.pointerType === 'mouse' && e.button !== 0) return
    isLongPressed.value = false
    startX = e.clientX
    startY = e.clientY
    timer = setTimeout(() => {
      isLongPressed.value = true
      options.onLongPress(e)
      timer = undefined
    }, options.threshold ?? 500)
  }

  function onPointermove(e: PointerEvent) {
    if (timer === undefined) return
    const tolerance = options.moveTolerance ?? 10
    if (Math.abs(e.clientX - startX) > tolerance || Math.abs(e.clientY - startY) > tolerance) clearTimer()
  }

  function onPointerup(e: PointerEvent) {
    const wasLongPress = isLongPressed.value
    clearTimer()
    if (!wasLongPress) options.onClick?.(e)
  }

  function onPointercancel() {
    clearTimer()
  }

  onBeforeUnmount(clearTimer)

  return {
    isLongPressed,
    handlers: {
      onPointerdown,
      onPointermove,
      onPointerup,
      onPointercancel,
      onPointerleave: onPointercancel,
    },
  }
}
