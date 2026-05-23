'use client'

import { useSession } from '@yukinu/auth/react'
import { Loader2Icon } from '@yukinu/ui/icons'
import { usePathname } from 'next/navigation'
import Script from 'next/script'
import * as React from 'react'

import { Navigate } from '@/components/navigate'
import { env } from '@/lib/env'

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: string | HTMLElement,
        options: {
          sitekey: string
          'response-field-name'?: string
          callback?: (token: string) => void
        },
      ) => string

      remove: (widgetId: string) => void
    }
  }
}

export const AuthLayoutClient: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { status } = useSession()

  if (status === 'loading')
    return (
      <div className='grid min-h-dvh place-items-center'>
        <Loader2Icon className='animate-spin' />
      </div>
    )

  if (status === 'authenticated') return <Navigate href='/' replace />

  return <LoadTurnstile>{children}</LoadTurnstile>
}

const TurnstileContext = React.createContext<{ id: string | null } | null>(null)

export const useTurnstile = () => {
  const context = React.use(TurnstileContext)
  if (context === null) throw new Error('Turnstile widget not loaded yet')
  return context.id
}

const LoadTurnstile: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const pathname = usePathname()
  const [widgetId, setWidgetId] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (!window.turnstile?.render) return

    const id = window.turnstile.render('.cf-turnstile', {
      sitekey: env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
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
  }, [pathname])

  return (
    <TurnstileContext value={{ id: widgetId }}>
      {children}

      <Script
        id='turnstile-script'
        src='https://challenges.cloudflare.com/turnstile/v0/api.js'
        async
        defer
      />
    </TurnstileContext>
  )
}
