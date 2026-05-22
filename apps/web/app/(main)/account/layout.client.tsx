'use client'

import { useSession } from '@yukinu/auth/react'
import { Loader2Icon } from '@yukinu/ui/icons'
import { usePathname } from 'next/navigation'

import { Navigate } from '@/components/navigate'

export const CheckAuthentication: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  const { status } = useSession()
  const pathname = usePathname()

  if (status === 'loading')
    return (
      <div className='grid min-h-[calc(100dvh-3.5rem)] place-items-center'>
        <Loader2Icon className='animate-spin' />
      </div>
    )

  if (status === 'unauthenticated')
    return <Navigate href={`/login?redirect_to=${pathname}`} replace />

  return children
}
