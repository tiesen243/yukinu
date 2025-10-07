'use client'

import { useSuspenseQuery } from '@tanstack/react-query'

import { Avatar, AvatarFallback, AvatarImage } from '@yukinu/ui/avatar'

import { useTRPC } from '@/trpc/react'

export const ProfileHeader: React.FC = () => {
  const trpc = useTRPC()
  const { data } = useSuspenseQuery(trpc.user.profile.queryOptions())

  return (
    <section className='mb-8 flex flex-col items-center justify-center gap-6 text-center sm:flex-row sm:justify-start sm:text-start'>
      <h2 className='sr-only'>Profile Header: User Avatar and Name</h2>

      <Avatar className='size-20 border-2 border-border'>
        <AvatarImage
          src={data.avatarUrl ?? ''}
          alt={data.fullName ?? data.username}
        />
        <AvatarFallback>{data.username.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>

      <div>
        <h3 className='text-3xl font-bold text-foreground'>
          {data.fullName ?? data.username}
        </h3>
        <p className='text-sm text-muted-foreground'>@{data.username}</p>
      </div>
    </section>
  )
}

export const ProfileHeaderSkeleton: React.FC = () => (
  <section className='mb-8 flex flex-col items-center justify-center gap-6 text-center sm:flex-row sm:justify-start sm:text-start'>
    <h2 className='sr-only'>Profile Header: User Avatar and Name</h2>

    <Avatar className='size-20 border-2 border-border'>
      <AvatarFallback className='animate-pulse' />
    </Avatar>

    <div>
      <h3 className='w-80 animate-pulse rounded-md bg-current text-3xl font-bold'>
        &nbsp;
      </h3>
      <p className='w-40 animate-pulse rounded-md bg-current text-sm text-muted-foreground'>
        &nbsp;
      </p>
    </div>
  </section>
)
