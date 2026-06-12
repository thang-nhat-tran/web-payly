import { computed, useAttrs } from 'vue'
import type { ClassValue } from 'clsx'
import { cn } from '@/shared/utils/cn.util'

/**
 * Merges a component's base classes with any consumer-passed `class`
 * (Tailwind-aware, via {@link cn}) and returns the remaining attrs so they
 * can be forwarded without re-applying `class` twice.
 *
 * Pair with `defineOptions({ inheritAttrs: false })` on a single-root component:
 *
 * ```ts
 * defineOptions({ inheritAttrs: false })
 * const { rootClass, attrs } = useMergedAttrs('base-classes')
 * ```
 * ```html
 * <div :class="rootClass" v-bind="attrs"><slot /></div>
 * ```
 *
 * Pass a getter when the base classes depend on reactive props/state.
 */
export function useMergedAttrs(base: ClassValue | (() => ClassValue)) {
  const raw = useAttrs()

  const rootClass = computed(() => cn(typeof base === 'function' ? base() : base, raw.class as ClassValue))

  const attrs = computed(() => {
    const { class: _class, ...rest } = raw
    return rest
  })

  return { rootClass, attrs }
}
