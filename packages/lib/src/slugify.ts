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
