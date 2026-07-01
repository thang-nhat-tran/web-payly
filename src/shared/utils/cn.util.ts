import { type ClassValue, clsx } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

/**
 * tailwind-merge configured with the custom theme scales declared in
 * `src/styles/global.css` (@theme). tailwind-merge does not read the CSS,
 * so each custom scale value must be registered here for conflicting
 * utilities (e.g. `p-md` vs `p-lg`, `bg-bg-surface` vs `bg-bg-soft`) to
 * resolve to the last one rather than both surviving.
 *
 * tailwind-merge v3 theme keys mirror Tailwind v4 `@theme` namespaces:
 * `spacing` → --spacing-*, `radius` → --radius-*, `text` → --text-*, etc.
 */
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      spacing: ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl'],
      radius: ['xs', 'sm', 'md', 'lg', 'xl', 'round', 'pill'],
      text: ['xs', 'sm', 'md', 'lg', 'xl'],
      tracking: ['tight', 'normal', 'wide'],
      shadow: ['sm', 'md', 'lg'],
      color: [
        'bg-base',
        'bg-elevated',
        'bg-surface',
        'bg-soft',
        'text-main',
        'text-secondary',
        'text-muted',
        'text-accent',
        'text-disabled',
        'danger-main',
        'danger-light',
        'danger-bg',
        'danger-border',
        'success',
        'success-bg',
        'success-border',
        'warning-bg',
        'warning-border',
        'info-bg',
        'info-border',
        'action-secondary',
        'link',
        'brand-primary',
        'brand-secondary',
      ],
    },
  },
})

/**
 * Merge class names with Tailwind-aware conflict resolution.
 * Accepts the same inputs as clsx (strings, arrays, objects); later
 * conflicting Tailwind utilities win.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
