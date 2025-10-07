'use client'

import { useSuspenseQuery } from '@tanstack/react-query'

import { CardContent, CardFooter } from '@yukinu/ui/card'

import { formatDate } from '@/lib/utils'
import { useTRPC } from '@/trpc/react'

export const BasicInformation = () => {
  const trpc = useTRPC()
  const { data } = useSuspenseQuery(trpc.user.profile.queryOptions())

  const infoFields = [
    { label: 'Full Name', value: data.fullName ?? 'not set' },
    { label: 'Username', value: `@${data.username}` },
    { label: 'Email', value: data.email },
    { label: 'Date of Birth', value: data.dateOfBirth ?? 'not set' },
    { label: 'Gender', value: data.gender ?? 'not set' },
    { label: 'Website', value: data.website ?? 'not set' },
  ]

  return (
    <>
      <CardContent className='grid w-full gap-4 sm:grid-cols-2'>
        {infoFields.map((field) => (
          <div key={field.label}>
            <p className='text-sm text-muted-foreground'>{field.label}</p>
            <p className='font-medium'>{field.value}</p>
          </div>
        ))}

        <div className='sm:col-span-2'>
          {' '}
          <p className='text-sm text-muted-foreground'>Bio</p>
          <p className='font-medium'>
            {data.bio ?? 'This user has not set a bio yet.'}
          </p>
        </div>
      </CardContent>

      <CardFooter className='grid gap-4 border-t md:grid-cols-2'>
        <div className='sm:col-span-2'>
          <p className='text-sm text-muted-foreground'>User ID</p>
          <p className='font-medium'>{data.id}</p>
        </div>
        <div>
          <p className='text-sm text-muted-foreground'>Member since</p>
          <p className='font-medium'>{formatDate(data.createdAt)}</p>
        </div>
        <div>
          <p className='text-sm text-muted-foreground'>Last updated</p>
          <p className='font-medium'>{formatDate(data.updatedAt)}</p>
        </div>
      </CardFooter>
    </>
  )
}

export const BasicInformationSkeleton = () => {
  return (
    <>
      <CardContent className='grid w-full gap-4 sm:grid-cols-2'>
        {Array.from({ length: 6 }, (_, index) => (
          <div key={index}>
            <p className='w-1/2 animate-pulse rounded-md bg-current text-sm text-muted-foreground'>
              &nbsp;
            </p>
            <p className='w-3/4 animate-pulse rounded-md bg-current font-medium'>
              &nbsp;
            </p>
          </div>
        ))}

        <div className='sm:col-span-2'>
          <p className='w-1/2 animate-pulse rounded-md bg-current text-sm text-muted-foreground'>
            &nbsp;
          </p>
          <p className='w-3/4 animate-pulse rounded-md bg-current font-medium'>
            &nbsp;
          </p>
        </div>
      </CardContent>

      <CardFooter className='grid gap-4 border-t md:grid-cols-2'>
        <div className='sm:col-span-2'>
          <p className='w-1/2 animate-pulse rounded-md bg-current text-sm text-muted-foreground'>
            &nbsp;
          </p>
          <p className='w-3/4 animate-pulse rounded-md bg-current font-medium'>
            &nbsp;
          </p>
        </div>
        {Array.from({ length: 2 }, (_, index) => (
          <div key={index}>
            <p className='w-1/2 animate-pulse rounded-md bg-current text-sm text-muted-foreground'>
              &nbsp;
            </p>
            <p className='w-3/4 animate-pulse rounded-md bg-current font-medium'>
              &nbsp;
            </p>
          </div>
        ))}
      </CardFooter>
    </>
  )
}
