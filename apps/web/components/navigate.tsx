'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export interface NavigateProps {
  href: __next_route_internal_types__.RouteImpl<unknown>
  replace?: boolean
}

export function Navigate({ href, replace }: NavigateProps) {
  const router = useRouter()

  useEffect(() => {
    if (replace) router.replace(href)
    else router.push(href)
  }, [href, replace, router])

  return null
}
