import { Button } from '@yukinu/ui/button'
import { PlusIcon } from '@yukinu/ui/icons'
import Link from 'next/link'
import { Suspense } from 'react'

import { AccountHeader } from '@/app/(main)/account/_components/header'
import {
  AddressesList,
  AddressesListSkeleton,
} from '@/app/(main)/account/address/page.client'
import { createMetadata } from '@/lib/metadata'
import { getQueryClient, HydrateClient, trpc } from '@/lib/trpc/rsc'

export const dynamic = 'force-dynamic'

export default function AddressPage() {
  void getQueryClient().prefetchQuery(trpc.address.all.queryOptions({}))

  return (
    <HydrateClient>
      <AccountHeader
        title='My Addresses'
        description='View, add, and manage your saved shipping addresses for faster checkout.'
      />

      <section className='flex flex-col gap-4 px-6'>
        <h2 className='sr-only'>Address List section</h2>

        <Suspense fallback={<AddressesListSkeleton />}>
          <AddressesList />
        </Suspense>

        <Button
          variant='outline'
          nativeButton={false}
          render={
            <Link href='/account/address/new'>
              <PlusIcon /> Add New Address
            </Link>
          }
        />
      </section>
    </HydrateClient>
  )
}

const title = 'My Addresses'
const description =
  'View, add, and manage your saved shipping addresses for faster checkout.'
export const metadata = createMetadata({
  title,
  description,
  openGraph: {
    images: [
      `/api/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(
        description,
      )}`,
    ],
    url: `/account/address`,
  },
})
