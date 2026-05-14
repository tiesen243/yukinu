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
    if (document.querySelector('#turnstile-script')) return

    const script = document.createElement('script')
    script.id = 'turnstile-script'
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js'

    script.async = true
    script.defer = true

    document.body.append(script)
  }, [pathname])

  useEffect(() => {
    const el = document.querySelector('.cf-turnstile')
    if (!el || !window.turnstile) return

    el.innerHTML = ''
    window.turnstile.render(el as HTMLElement, {
      sitekey: env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
    })
  }, [pathname])

  return null
}
