'use client'

import { useSuspenseQuery } from '@tanstack/react-query'
import { Avatar, AvatarFallback, AvatarImage } from '@yukinu/ui/avatar'
import { Card } from '@yukinu/ui/card'
import { UserIcon } from '@yukinu/ui/icons'
import { Typography } from '@yukinu/ui/typography'

import { useTRPC } from '@/lib/trpc/react'

export const UserProfileDetails: React.FC<{ id: string }> = ({ id }) => {
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

        <Avatar className='size-full aspect-video md:aspect-3/1 rounded-none after:border-none'>
          <AvatarImage
            src={data.profile.banner ?? ''}
            alt='banner'
            className='rounded-none'
          />
          <AvatarFallback className='rounded-none'>
            <Typography className='text-muted-foreground'>
              This is supercalifragilisticexpialidocious banner
            </Typography>
          </AvatarFallback>
        </Avatar>

        <div className='-mt-28 md:-mt-14 mx-8 relative flex-col flex items-center gap-4 md:flex-row'>
          <Avatar className='size-32 border-4 border-background after:border-none'>
            <AvatarImage src={data.image ?? ''} alt={data.username} />
            <AvatarFallback>
              <UserIcon className='size-16 text-muted-foreground' />
            </AvatarFallback>
          </Avatar>

          <div className='md:mt-8 flex flex-col sm:flex-row items-center gap-2'>
            <Typography variant='h2' className='my-0'>
              {data.profile.fullName}
            </Typography>
            <Typography className='text-muted-foreground'>
              @{data.username}
            </Typography>
          </div>
        </div>

        {data.profile.bio && (
          <Typography
            variant='blockquote'
            className='text-center my-0 border-0 px-4'
          >
            {data.profile.bio}
          </Typography>
        )}
      </Card>

      <Card render={<section />} className='px-4 gap-0'>
        <h2 className='sr-only'>User Profile Details</h2>

        <div className='flex flex-col sm:flex-row sm:items-center sm:gap-4'>
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
