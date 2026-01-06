'use client'

import { useSession } from '@yukinu/auth/react'
import { Avatar, AvatarFallback, AvatarImage } from '@yukinu/ui/avatar'
import { UserIcon } from '@yukinu/ui/icons'

export const UserHeader: React.FC = () => {
  const { status, session } = useSession()

  if (status !== 'authenticated') return null
  const { user } = session

  return (
    <div className='flex h-16 items-start gap-2 border-b px-6'>
      <Avatar className='size-12'>
        <AvatarImage src={user.image ?? ''} alt={user.username} />
        <AvatarFallback>
          <UserIcon className='size-6 text-muted-foreground' />
        </AvatarFallback>
      </Avatar>

      <div className='flex w-max flex-col gap-1 overflow-hidden'>
        <p className='truncate'>{user.username}</p>
        <p className='truncate text-sm text-muted-foreground'>{user.email}</p>
      </div>
    </div>
  )
}
