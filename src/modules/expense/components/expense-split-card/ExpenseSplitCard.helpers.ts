const amountFormatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
})

const dateFormatter = new Intl.DateTimeFormat('vi-VN', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

export const formatAmount = (amount: number): string =>
  amountFormatter.format(amount)

export const formatDate = (iso: string): string =>
  dateFormatter.format(new Date(iso))
