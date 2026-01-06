'use client'

import { useSuspenseQuery } from '@tanstack/react-query'
import { Card } from '@yukinu/ui/card'
import { Typography } from '@yukinu/ui/typography'
import Image from 'next/image'

import { useTRPC } from '@/lib/trpc/react'

export const UserProfile: React.FC<{ id: string }> = ({ id }) => {
  const trpc = useTRPC()
  const { data } = useSuspenseQuery(
    trpc.user.publicProfile.queryOptions({ id }),
  )

  return (
    <>
      <Card
        render={<section />}
        className='mb-4 pt-0 rounded-t-none *:[img:first-child]:rounded-t-none'
      >
        <h2 className='sr-only'>User Profile Header</h2>

        <Image
          src={data.profile.banner ?? ''}
          alt='banner'
          className='w-full aspect-3/1 object-cover'
          width={1200}
          height={630}
        />

        <div className='-mt-24 md:-mt-12 mx-8 relative flex-col flex items-center gap-4 md:flex-row'>
          <Image
            src={data.image ?? ''}
            alt='avatar'
            width={128}
            height={128}
            className='rounded-full border-4 border-background'
          />

          <div className='md:mt-12 flex flex-col sm:flex-row items-center gap-2'>
            <Typography variant='h2' className='my-0'>
              {data.profile.fullName}
            </Typography>
            <Typography className='text-muted-foreground'>
              @{data.username}
            </Typography>
          </div>
        </div>

        <Typography
          variant='blockquote'
          className='text-center my-0 border-0 px-4'
        >
          {data.profile.bio}
        </Typography>
      </Card>

      <Card render={<section />} className='px-4 gap-0'>
        <h2 className='sr-only'>User Profile Details</h2>

        <div className='flex flex-col sm:flex-row sm:items-center sm:gap-4 text-sm text-muted-foreground'>
          <Typography className='sm:[&:not(:first-child)]:mt-0'>
            <strong>Gender:</strong> {data.profile.gender || '—'}
          </Typography>
          <Typography className='sm:[&:not(:first-child)]:mt-0'>
            <strong>Role:</strong>{' '}
            {data.role.charAt(0).toUpperCase() + data.role.slice(1)}
          </Typography>
        </div>

        <Typography>
          Joined{' '}
          {new Intl.DateTimeFormat('en', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          }).format(data.createdAt)}
        </Typography>
      </Card>
    </>
  )
}
