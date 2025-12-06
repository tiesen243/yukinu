import { Suspense } from 'react'
import Link from 'next/link'

import { Button } from '@yukinu/ui/button'
import { PlusIcon } from '@yukinu/ui/icons'

import { AccountHeader } from '@/app/(main)/account/_components/header'
import {
  AddressesList,
  AddressesListSkeleton,
} from '@/app/(main)/account/address/page.client'
import { getQueryClient, HydrateClient, trpc } from '@/lib/trpc/rsc'

export const dynamic = 'force-dynamic'
export default function AddressPage() {
  void getQueryClient().prefetchQuery(trpc.user.allAddresses.queryOptions({}))

  return (
    <HydrateClient>
      <AccountHeader
        title='My Addresses'
        description='View, add, and manage your saved shipping addresses for faster checkout.'
      />

      <section className='flex flex-col gap-4 px-6 pt-6'>
        <h2 className='sr-only'>Address List section</h2>

        <Suspense fallback={<AddressesListSkeleton />}>
          <AddressesList />
        </Suspense>

        <Button variant='outline' asChild>
          <Link href='/account/address/new'>
            <PlusIcon /> Add New Address
          </Link>
        </Button>
      </section>
    </HydrateClient>
  )
}
