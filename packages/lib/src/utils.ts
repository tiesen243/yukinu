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

export function formatPrice(price: string | number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(typeof price === 'string' ? Number.parseFloat(price) : price)
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d)
}
