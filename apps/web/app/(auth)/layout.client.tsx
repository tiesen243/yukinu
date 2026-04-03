'use client'

import { useEffect } from 'react'

export default function AuthLayoutClient({ children }: LayoutProps<'/'>) {
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js'
    script.async = true
    document.body.append(script)

    return () => {
      script.remove()
    }
  }, [])

  return children
}
