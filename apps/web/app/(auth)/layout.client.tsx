'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'

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
      ) => string

      remove: (widgetId: string) => void
    }
  }
}

export const LoadTurnstile: React.FC = () => {
  const pathname = usePathname()
  const widgetIdRef = useRef<string | null>(null)

  useEffect(() => {
    if (!window.turnstile?.render) return

    widgetIdRef.current = window.turnstile.render('.cf-turnstile', {
      sitekey: env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
    })

    return () => {
      if (widgetIdRef.current && window.turnstile?.remove) {
        window.turnstile.remove(widgetIdRef.current)
        widgetIdRef.current = null
      }
    }
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
