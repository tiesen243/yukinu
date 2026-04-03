import { verifyTurnstileToken } from '@/lib/verify-turnstile'

export async function verifyTurnstile(
  event?: Record<string, unknown>,
): Promise<void> {
  if (
    !(event instanceof SubmitEvent && event.target instanceof HTMLFormElement)
  )
    return

  const token = new FormData(event.target).get('cf-turnstile-response')
  if (typeof token !== 'string') throw new Error('Turnstile token is missing')

  const { success } = await verifyTurnstileToken(token)
  if (!success) throw new Error('Turnstile verification failed')
}
