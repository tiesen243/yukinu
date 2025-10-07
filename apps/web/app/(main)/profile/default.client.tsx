'use client'

import { useSuspenseQuery } from '@tanstack/react-query'

import { Avatar, AvatarFallback, AvatarImage } from '@yukinu/ui/avatar'
import { Button } from '@yukinu/ui/button'
import { SettingsIcon } from '@yukinu/ui/icons'

import { useTRPC } from '@/trpc/react'

export const ProfileDetails: React.FC = () => {
  const trpc = useTRPC()
  const { data } = useSuspenseQuery(trpc.user.profile.queryOptions())

  return (
    <section className='mb-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between'>
      <h2 className='sr-only'>Profile Details of {data.username}</h2>

      <section className='flex items-center gap-4'>
        <h3 className='sr-only'>User Avatar and Name</h3>

        <Avatar className='size-20 border-2 border-border'>
          <AvatarImage
            src={data.avatarUrl ?? ''}
            alt={data.fullName ?? data.username}
          />
          <AvatarFallback className='bg-accent text-xl text-accent-foreground'>
            {data.fullName}
          </AvatarFallback>
        </Avatar>
        <div>
          <h4 className='text-3xl font-bold text-foreground'>
            {data.fullName ?? data.username}
          </h4>
          <p className='text-sm text-muted-foreground'>@{data.username}</p>
        </div>
      </section>

      <Button variant='outline'>
        <SettingsIcon /> Edit Profile
      </Button>
    </section>
  )
}

export const ProfileDetailsSkeleton: React.FC = () => (
  <section className='mb-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between'>
    <h2 className='sr-only'>Profile Details of Loading...</h2>

    <section className='flex items-center gap-4'>
      <h3 className='sr-only'>User Avatar and Name</h3>

      <Avatar className='size-20 border-2 border-border'>
        <AvatarFallback className='animate-pulse bg-accent text-xl text-accent-foreground' />
      </Avatar>
      <div>
        <h4 className='w-80 animate-pulse rounded-md bg-current text-3xl font-bold'>
          &nbsp;
        </h4>
        <p className='w-40 animate-pulse rounded-md bg-current text-sm text-muted-foreground'>
          &nbsp;
        </p>
      </div>
    </section>

    <Button variant='outline'>
      <SettingsIcon /> Edit Profile
    </Button>
  </section>
)
