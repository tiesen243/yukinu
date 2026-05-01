import { useEffect } from 'react'
import { Outlet } from 'react-router'

import type { Route } from './+types/turnstile'

export default function TurnstileChallenge(_: Route.ComponentProps) {
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js'
    script.async = true
    document.body.append(script)

    return () => script.remove()
  }, [])

  return <Outlet />
}
