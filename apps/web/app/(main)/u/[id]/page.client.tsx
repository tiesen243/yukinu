'use client'

import { useSuspenseQuery } from '@tanstack/react-query'
import { Avatar, AvatarFallback, AvatarImage } from '@yukinu/ui/avatar'
import { Card } from '@yukinu/ui/card'
import { UserIcon } from '@yukinu/ui/icons'
import { Typography } from '@yukinu/ui/typography'

import { useTRPC } from '@/lib/trpc'

export const UserDetails: React.FC<{ id: string }> = ({ id }) => {
  const { trpc } = useTRPC()
  const { data } = useSuspenseQuery(
    trpc.identity.user.publicProfile.queryOptions({ id }),
  )

  return (
    <>
      <Card
        render={<section />}
        className='mb-4 rounded-t-none pt-0 *:[img:first-child]:rounded-t-none'
      >
        <h2 className='sr-only'>User Profile Header</h2>

        <Avatar className='aspect-video size-full rounded-none after:border-none md:aspect-3/1'>
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

        <div className='relative mx-8 -mt-28 flex flex-col items-center gap-4 md:-mt-14 md:flex-row'>
          <Avatar className='size-32 border-4 border-background after:border-none'>
            <AvatarImage src={data.user.image ?? ''} alt={data.user.username} />
            <AvatarFallback>
              <UserIcon className='size-16 text-muted-foreground' />
            </AvatarFallback>
          </Avatar>

          <Typography variant='h2' className='my-0 md:mt-8'>
            {data.profile.fullName}
          </Typography>
        </div>

        {data.profile.bio && (
          <Typography
            variant='blockquote'
            className='my-0 border-0 px-4 text-center'
          >
            {data.profile.bio}
          </Typography>
        )}
      </Card>

      <Card render={<section />} className='gap-0 px-4'>
        <h2 className='sr-only'>User Profile Details</h2>

        <div className='flex flex-col sm:flex-row sm:items-center sm:gap-4'>
          <Typography>
            <strong>Gender:</strong> {data.profile.gender || '—'}
          </Typography>
          <Typography className='not-first:mt-0 last:mb-0'>
            <strong>Role:</strong>{' '}
            {data.user.role.charAt(0).toUpperCase() + data.user.role.slice(1)}
          </Typography>
        </div>

        <Typography>
          Joined{' '}
          {new Intl.DateTimeFormat('en', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          }).format(data.user.createdAt)}
        </Typography>
      </Card>
    </>
  )
}
