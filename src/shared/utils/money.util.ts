import type { SupportedLocale, SupportedCurrency } from '../types/app-setting.type'
import { getNumberFormatter } from './number.util'

export function formatMoney(value: number, locale: SupportedLocale, currency: SupportedCurrency): string {
  return getNumberFormatter({
    locale,
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  }).format(value)
}

/**
 * Returns the currency symbol for a locale + currency (e.g. "₫").
 * Falls back to the currency code if no symbol part is found.
 * @example getCurrencySymbol('vi-VN', 'VND') // "₫"
 */
export function getCurrencySymbol(locale: SupportedLocale, currency: SupportedCurrency): string {
  const part = getNumberFormatter({ locale, style: 'currency', currency })
    .formatToParts(0)
    .find((p) => p.type === 'currency')
  return part?.value ?? currency
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
