'use client'

import { useLayoutEffect } from 'react'
import { useRouter } from 'next/navigation'

import { useSession } from '@yukinu/auth/react'
import { Avatar, AvatarFallback, AvatarImage } from '@yukinu/ui/avatar'

export const UserHeader: React.FC = () => {
  const { status, session } = useSession()
  const router = useRouter()

  useLayoutEffect(() => {
    if (status === 'unauthenticated') router.replace('/login')
  }, [router, status])

  if (status !== 'authenticated') return null
  const { user } = session

  return (
    <div className='flex h-16 items-start gap-2 border-b px-6'>
      <Avatar className='size-12'>
        <AvatarImage src={user.image ?? ''} alt={user.username} />
        <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>

      <div className='flex w-max flex-col gap-1 overflow-hidden'>
        <p className='truncate'>{user.username}</p>
        <p className='truncate text-sm text-muted-foreground'>{user.email}</p>
      </div>
    </div>
  )
}
