import { useEffect } from 'react'
import { Outlet } from 'react-router'

export default function TurnstileChallenge() {
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js'
    script.async = true
    document.body.append(script)

    return () => {
      script.remove()
    }
  }, [])

  return <Outlet />
}
