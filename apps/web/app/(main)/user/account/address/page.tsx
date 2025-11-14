import { Suspense } from 'react'
import Link from 'next/link'

import { Button } from '@yukinu/ui/button'

import {
  AddressList,
  AddressListSkeleton,
} from '@/app/(main)/user/account/address/page.client'
import { getQueryClient, HydrateClient, trpc } from '@/trpc/rsc'

export default function AddressPage() {
  void getQueryClient().prefetchQuery(trpc.address.all.queryOptions({}))

  return (
    <HydrateClient>
      <section>
        <div className='flex items-center justify-between px-4'>
          <h3 className='text-lg font-medium'>Address Management</h3>
          <Button size='sm' asChild>
            <Link href='/user/account/address/new'>Add New Address</Link>
          </Button>
        </div>
        <hr className='my-4' />

        <Suspense fallback={<AddressListSkeleton />}>
          <AddressList />
        </Suspense>
      </section>
    </HydrateClient>
  )
}
