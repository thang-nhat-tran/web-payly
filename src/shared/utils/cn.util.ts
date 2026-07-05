import { type ClassValue, clsx } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

/**
 * tailwind-merge configured with the custom theme scales declared in
 * `src/styles/global.css` (@theme). tailwind-merge does not read the CSS,
 * so each custom scale value must be registered here for conflicting
 * utilities (e.g. `p-md` vs `p-lg`, `bg-bg-elevated` vs `bg-bg-soft`) to
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
      text: ['xs', 'sm', 'md', 'base', 'lg', 'xl', '2xl', '3xl'],
      tracking: ['tight', 'normal', 'wide'],
      shadow: ['sm', 'md', 'lg'],
      color: [
        'primary',
        'text',
        'text-secondary',
        'text-tertiary',
        'text-quaternary',
        'border',
        'border-secondary',
        'bg-layout',
        'bg-elevated',
        'bg-mask',
        'success',
        'success-hover',
        'success-bg',
        'success-bg-hover',
        'success-border',
        'success-border-hover',
        'success-text',
        'warning',
        'warning-hover',
        'warning-bg',
        'warning-bg-hover',
        'warning-border',
        'warning-border-hover',
        'warning-text',
        'error',
        'error-hover',
        'error-bg',
        'error-bg-hover',
        'error-text',
        'info',
        'info-hover',
        'info-bg',
        'info-bg-hover',
        'info-border',
        'info-border-hover',
        'info-text',
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
