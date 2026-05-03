import { Card } from '@yukinu/ui/card'
import { useEffect } from 'react'
import { Outlet } from 'react-router'

import type { Route } from './+types/turnstile'

export default function TurnstileChallenge(_: Route.ComponentProps) {
  useEffect(() => {
    if (document.querySelector('#turnstile-script')) return

    const script = document.createElement('script')
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js'
    script.async = true
    document.body.append(script)

    return () => script.remove()
  }, [])

  return (
    <main className='flex h-dvh flex-col items-center justify-center px-4'>
      <Card className='min-w-full md:max-w-xl md:min-w-xl'>
        <Outlet />
      </Card>
    </main>
  )
}
