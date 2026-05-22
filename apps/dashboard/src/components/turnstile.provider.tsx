import * as React from 'react'
import { useLocation } from 'react-router'

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

const TurnstileContext = React.createContext<{ id: string } | null>(null)

const useTurnstile = () => {
  const context = React.use(TurnstileContext)
  if (context === null) throw new Error('Turnstile widget not loaded yet')
  return context.id
}

function TurnstileChallengeScript({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const location = useLocation()
  const [widgetId, setWidgetId] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (!window.turnstile?.render) return

    const id = window.turnstile.render('.cf-turnstile', {
      sitekey: env.VITE_TURNSTILE_SITE_KEY,
    })
    setWidgetId(id)

    return () => {
      if (id && window.turnstile?.remove) {
        try {
          window.turnstile.remove(id)
          // oxlint-disable-next-line no-empty
        } catch {}
        setWidgetId(null)
      }
    }
  }, [location])

  return (
    <TurnstileContext value={{ id: widgetId ?? '' }}>
      {children}

      <script
        id='turnstile-script'
        src='https://challenges.cloudflare.com/turnstile/v0/api.js'
        async
        defer
      />
    </TurnstileContext>
  )
}

export { TurnstileChallengeScript, useTurnstile }
