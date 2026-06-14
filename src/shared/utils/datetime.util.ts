import type { SupportedLocale } from '@/shared/types/app-setting.type'
import { createCachedInstance } from './cached-instance-factory.util'

type DateTimeFormatOptions = Intl.DateTimeFormatOptions & { locale: SupportedLocale }
const getDateTimeFormat = createCachedInstance(
  (options: DateTimeFormatOptions) => new Intl.DateTimeFormat(options.locale, options),
)

export type DateFormatStyle = 'shortDate' | 'mediumDate' | 'longDate' | 'dateTime' | 'time'

const DATE_FORMAT_OPTIONS: Record<DateFormatStyle, Intl.DateTimeFormatOptions> = {
  shortDate: {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  },

  mediumDate: {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  },

  longDate: {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  },

  dateTime: {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  },

  time: {
    hour: '2-digit',
    minute: '2-digit',
  },
}

export function formatDate(
  value: string | number | Date,
  locale: SupportedLocale,
  style: DateFormatStyle = 'longDate',
): string {
  return `${getDateTimeFormat({ locale, ...DATE_FORMAT_OPTIONS[style] }).format(new Date(value))}`
}

export function getToday(locale: SupportedLocale, style: DateFormatStyle = 'longDate'): string {
  return `${getDateTimeFormat({ locale, ...DATE_FORMAT_OPTIONS[style] }).format(new Date())}`
}
