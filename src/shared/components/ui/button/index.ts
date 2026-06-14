import { cva, type VariantProps } from 'class-variance-authority'

export { default as Button } from './Button.vue'

/**
 * Button class recipe (shadcn-vue style) built on `class-variance-authority`,
 * mapped to this project's design tokens in `global.css`. Exported so other
 * elements can be styled as buttons, e.g.:
 *
 * ```vue
 * <RouterLink :class="buttonVariants({ variant: 'outline' })">Link</RouterLink>
 * ```
 *
 * Consumer classes still win — components pass the result through `cn()`,
 * which tailwind-merges any overriding utilities.
 */
export const buttonVariants = cva(
  [
    'inline-flex shrink-0 items-center justify-center gap-xs whitespace-nowrap',
    'rounded-md border-[1.5px] border-transparent text-sm font-medium tracking-tight',
    'cursor-pointer select-none outline-none transition-all duration-150 ease-standard',
    'active:scale-[0.97]',
    'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-40',
    '[&_svg]:pointer-events-none [&_svg]:shrink-0',
  ],
  {
    variants: {
      variant: {
        default: 'bg-text-main text-bg-base border-text-main hover:opacity-[0.88]',
        secondary: 'bg-bg-surface text-text-main border-text-main font-normal hover:opacity-[0.8]',
        outline: 'bg-bg-surface text-text-main border-text-disabled hover:border-text-muted',
        ghost: 'border-transparent text-text-main hover:bg-bg-soft',
        destructive: 'bg-danger-main text-bg-surface border-danger-main hover:opacity-[0.88]',
        link: 'border-transparent text-link underline-offset-4 hover:underline',
      },
      size: {
        default: 'px-[24px] py-[6px]',
        sm: 'px-[16px] py-[4px] text-xs',
        lg: 'rounded-lg px-[32px] py-[10px]',
        icon: 'size-[40px] p-0',
        'icon-sm': 'size-[32px] p-0',
        'icon-lg': 'size-[48px] p-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export type ButtonVariants = VariantProps<typeof buttonVariants>
export type ButtonVariant = NonNullable<ButtonVariants['variant']>
export type ButtonSize = NonNullable<ButtonVariants['size']>
