import { Card } from '@yukinu/ui/card'
import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router'

import { env } from '@/lib/env'

import type { Route } from './+types/turnstile'

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

export default function TurnstileChallenge(_: Route.ComponentProps) {
  const location = useLocation()

  useEffect(() => {
    if (!window.turnstile?.render) return

    window.turnstile.render('.cf-turnstile', {
      sitekey: env.VITE_TURNSTILE_SITE_KEY,
    })
  }, [location.pathname])

  return (
    <main className='flex h-dvh flex-col items-center justify-center px-4'>
      <Card className='min-w-full md:max-w-xl md:min-w-xl'>
        <Outlet />
      </Card>

      <script
        id='turnstile-script'
        src='https://challenges.cloudflare.com/turnstile/v0/api.js'
        async
        defer
      />
    </main>
  )
}
