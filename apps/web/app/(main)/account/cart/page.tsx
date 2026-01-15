import { ItemGroup } from '@yukinu/ui/item'
import { Suspense } from 'react'

import { AccountHeader } from '@/app/(main)/account/_components/header'
import {
  CartItemsList,
  CartItemsListSkeleton,
  CartItemsTotal,
  CartItemsTotalSkeleton,
} from '@/app/(main)/account/cart/page.client'
import { createMetadata } from '@/lib/metadata'
import { getQueryClient, trpc } from '@/lib/trpc/rsc'

export const dynamic = 'force-dynamic'

export default function AccountCartPage() {
  void getQueryClient().prefetchQuery(trpc.cart.get.queryOptions())

  return (
    <>
      <AccountHeader
        title='My Cart'
        description='View and manage the items in your shopping cart before proceeding to checkout.'
      />

      <section className='flex h-full flex-col px-6'>
        <h2 className='sr-only'>Cart Items List section</h2>

        <ItemGroup className='flex-1'>
          <Suspense fallback={<CartItemsListSkeleton />}>
            <CartItemsList />
          </Suspense>
        </ItemGroup>

        <Suspense fallback={<CartItemsTotalSkeleton />}>
          <CartItemsTotal />
        </Suspense>
      </section>
    </>
  )
}

const title = 'My Cart'
const description =
  'View and manage the items in your shopping cart before proceeding to checkout.'
export const metadata = createMetadata({
  title,
  description,
  openGraph: {
    images: [
      `/api/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(
        description,
      )}`,
    ],
    url: `/account/cart`,
  },
})
