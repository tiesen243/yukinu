'use client'

import { useSession } from '@yukinu/auth/react'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'

export const CheckAuthentication: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  const { status } = useSession()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (status === 'unauthenticated')
      router.push(`/login?redirect_to=${encodeURIComponent(pathname)}`)
  }, [pathname, router, status])

  return children
}
