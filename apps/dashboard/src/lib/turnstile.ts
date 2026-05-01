import { env } from '@/lib/env'

interface TurnstileResponse {
  success: boolean
  challenge_ts: string
  hostname: string
  error_codes?: string[]
}

export async function verifyTurnstileToken(
  token: string,
): Promise<TurnstileResponse> {
  const response = await fetch(
    'https://challenges.cloudflare.com/turnstile/v0/siteverify',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        secret: env.TURNSTILE_SECRET_KEY,
        response: token,
      }),
    },
  )

  if (!response.ok) throw new Error('Failed to verify Turnstile token')
  return response.json() as Promise<TurnstileResponse>
}

export async function verifyTurnstile(
  request: Request,
): Promise<{ success: true } | { success: false; message: string }> {
  const formData = await request.formData()

  const token = formData.get('cf-turnstile-response')
  if (typeof token !== 'string')
    return { success: false, message: 'Turnstile token is missing or invalid' }

  try {
    return verifyTurnstileToken(token) as Promise<{ success: true }>
  } catch {
    return { success: false, message: 'Failed to verify Turnstile token' }
  }
}
