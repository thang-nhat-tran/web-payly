import type { SupportedLocale } from '../types/app-setting.type'
import { createCachedInstance } from './cached-instance-factory.util'

type NumberFormatOptions = Intl.NumberFormatOptions & { locale: SupportedLocale }
export const getNumberFormatter = createCachedInstance(
  (options: NumberFormatOptions) => new Intl.NumberFormat(options.locale, options),
)

/**
 * Formats a number with the locale's grouping separators (no currency).
 * @example formatNumber(150000) // "150.000" (vi-VN)
 */
export function formatNumber(value: number, locale: SupportedLocale = 'vi-VN'): string {
  return getNumberFormatter({ locale }).format(value)
}
