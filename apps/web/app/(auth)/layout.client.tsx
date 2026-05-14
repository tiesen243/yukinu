'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

import { env } from '@/lib/env'

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: string | HTMLElement,
        options: {
          sitekey: string
          callback?: (token: string) => void
        },
      ) => void
    }
  }
}

export const LoadTurnstile: React.FC = () => {
  const pathname = usePathname()

  useEffect(() => {
    if (!window.turnstile?.render) return

    window.turnstile.render('.cf-turnstile', {
      sitekey: env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
    })
  }, [pathname])

  return (
    <script
      id='turnstile-script'
      src='https://challenges.cloudflare.com/turnstile/v0/api.js'
      async
      defer
    />
  )
}
