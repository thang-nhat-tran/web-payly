import type { SupportedLocale } from '@/shared/types/locale.type'
import { createCachedInstance } from './cached-instance-factory.util'

type NumberFormatOptions = Intl.NumberFormatOptions & { locale: SupportedLocale }
const getNumberFormatter = createCachedInstance(
  (options: NumberFormatOptions) => new Intl.NumberFormat(options.locale, options),
)

type SupportedCurrency = 'VND'
export function formatMoney(
  value: number,
  locale: SupportedLocale = 'vi-VN',
  currency: SupportedCurrency = 'VND',
): string {
  return getNumberFormatter({
    locale,
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  }).format(value)
}

/**
 * Formats a number as a compact "thousands" value with a `K` suffix, rounded
 * to at most one decimal place. Values below 1000 are returned as-is.
 * @example formatVNDtoK(500)     // "500"
 * @example formatVNDtoK(1500)    // "1,5K"
 * @example formatVNDtoK(1000000) // "1.000K"
 */
export function formatVNDtoK(value: number): string {
  if (value < 1000) return value.toString()

  return `${getNumberFormatter({ locale: 'vi-VN', minimumFractionDigits: 0, maximumFractionDigits: 1 }).format(value / 1000)}K`
}
