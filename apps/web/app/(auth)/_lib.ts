export const resetTurnstile = (widgetId: string | null = null) => {
  if (
    typeof window !== 'undefined' &&
    window.turnstile &&
    'reset' in window.turnstile &&
    typeof window.turnstile.reset === 'function'
  )
    window.turnstile.reset(widgetId)
}
