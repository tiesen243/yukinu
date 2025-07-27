import { Suspense } from 'react'
import Link from 'next/link'

import { Button } from '@yuki/ui/button'
import { Typography } from '@yuki/ui/typography'

import {
  AddressCardSkeleton,
  AddressList,
} from '@/app/(main)/account/address/page.client'
import { getQueryClient, HydrateClient, trpc } from '@/trpc/rsc'

export const dynamic = 'force-dynamic'

export default function ProfilePage() {
  void getQueryClient().prefetchQuery(trpc.address.all.queryOptions())

  return (
    <HydrateClient>
      <section className='w-full space-y-4'>
        <div className='flex items-start justify-between gap-4'>
          <Typography variant='h4' component='h2'>
            My Addresses
          </Typography>
          <Button asChild>
            <Link href='/profile/address/new'>Add New Address</Link>
          </Button>
        </div>

        <Suspense
          fallback={Array.from({ length: 3 }, (_, idx) => (
            <AddressCardSkeleton key={idx} />
          ))}
        >
          <AddressList />
        </Suspense>
      </section>
    </HydrateClient>
  )
}
