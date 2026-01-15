'use client'

import { useSession } from '@yukinu/auth/react'
import { Avatar, AvatarFallback, AvatarImage } from '@yukinu/ui/avatar'
import { UserIcon } from '@yukinu/ui/icons'

export const UserHeader: React.FC = () => {
  const { status, session } = useSession()

  if (status !== 'authenticated')
    return (
      <div className='flex h-16 items-start gap-2 border-b px-6' role='status'>
        <div className='aspect-square size-12 animate-pulse rounded-full bg-muted' />

        <div className='flex w-full flex-col gap-1 overflow-hidden'>
          <p className='w-1/2 animate-pulse rounded-sm bg-muted'>&nbsp;</p>
          <p className='w-2/3 animate-pulse rounded-sm bg-muted text-sm'>
            &nbsp;
          </p>
        </div>
      </div>
    )

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
