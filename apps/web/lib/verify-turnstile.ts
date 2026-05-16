'use server'

import { env } from '@/lib/env'

interface TurnstileResponse {
  success: boolean
  challenge_ts: string
  hostname: string
  error_codes?: string[]
}

async function verifyTurnstileToken(token: string): Promise<TurnstileResponse> {
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

export async function verifyTurnstile(formData: FormData): Promise<void> {
  const token = formData.get('cf-turnstile-response')
  if (typeof token !== 'string')
    throw new Error('Turnstile token is missing or invalid')

  const res = await verifyTurnstileToken(token)
  if (!res.success) throw new Error(`Turnstile verification failed`)
}
