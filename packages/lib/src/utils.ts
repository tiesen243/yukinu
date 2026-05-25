export function slugify(text: string): string {
  return text
    .replaceAll('Đ', 'D')
    .replaceAll('đ', 'd')
    .normalize('NFD')
    .replaceAll(/[\u0300-\u036F]/g, '')
    .toLowerCase()
    .trim()
    .replaceAll(/[\s\W-]+/g, '-')
    .replaceAll(/^-+|-+$/g, '')
}

// Exchange rates as of 2026-05-25
const REGION_CONFIGS: Record<string, { currency: string; rate: number }> = {
  vi: { currency: 'VND', rate: 26_358 },
  ja: { currency: 'JPY', rate: 158.86 },
  de: { currency: 'EUR', rate: 0.86 },
  fr: { currency: 'EUR', rate: 0.86 },
  zh: { currency: 'CNY', rate: 6.7948 },
  default: { currency: 'USD', rate: 1 },
} as const

export function formatPrice(price: string | number): string {
  const numericPrice =
    typeof price === 'string' ? Number.parseFloat(price) : price
  if (Number.isNaN(numericPrice)) return 'Invalid price'

  const browserLocale = navigator.language ?? 'en-US'
  const [primaryLang = 'default'] = browserLocale.split('-')

  const config = REGION_CONFIGS[primaryLang] ?? REGION_CONFIGS['default']
  if (!config) return 'Unsupported region'

  return new Intl.NumberFormat(browserLocale, {
    style: 'currency',
    currency: config.currency,
  }).format(numericPrice * config.rate)
}

export function formatDate(date: Date | string, showTime?: boolean): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...(showTime
      ? {
          hour: '2-digit',
          minute: '2-digit',
        }
      : {}),
    hour12: false,
  }).format(d)
}
