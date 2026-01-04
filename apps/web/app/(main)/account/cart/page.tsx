import {
  Table,
  TableBody,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@yukinu/ui/table'
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

      <section className='px-4'>
        <h2 className='sr-only'>Cart Items List section</h2>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='w-full'>Product</TableHead>
              <TableHead className='min-w-32'>Variant</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Unit Price</TableHead>
              <TableHead>Total Price</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            <Suspense fallback={<CartItemsListSkeleton />}>
              <CartItemsList />
            </Suspense>
          </TableBody>

          <TableFooter>
            <Suspense fallback={<CartItemsTotalSkeleton />}>
              <CartItemsTotal />
            </Suspense>
          </TableFooter>
        </Table>
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
