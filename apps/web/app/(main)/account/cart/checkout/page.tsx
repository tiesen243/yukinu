import { ItemGroup } from '@yukinu/ui/item'
import { Typography } from '@yukinu/ui/typography'
import { Suspense } from 'react'

import { AccountHeader } from '@/app/(main)/account/_components/header'
import {
  AddressSelector,
  Checkout,
  DiscountCodeInput,
  OrderItems,
  PaymentMethodSelector,
} from '@/app/(main)/account/cart/checkout/page.client'
import { PageProvider } from '@/app/(main)/account/cart/checkout/page.provider'
import {
  AddressSelectorSkeleton,
  CheckoutSkeleton,
  OrderItemsSkeleton,
} from '@/app/(main)/account/cart/checkout/page.skeleton'
import { createMetadata } from '@/lib/metadata'
import { getQueryClient, HydrateClient, trpc } from '@/lib/trpc/rsc'

export const dynamic = 'force-dynamic'

export default function AccountCartCheckoutPage() {
  // oxlint-disable-next-line promise/prefer-await-to-then
  void Promise.all([
    getQueryClient().prefetchQuery(trpc.cart.get.queryOptions({})),
    getQueryClient().prefetchQuery(trpc.address.all.queryOptions({})),
  ])

  return (
    <PageProvider>
      <HydrateClient>
        <AccountHeader
          title='Checkout'
          description='Review your order and proceed to payment to complete your purchase.'
        />

        <section>
          <h2 className='sr-only'>Order Items section</h2>

          <ItemGroup className='border-b px-4 pb-6'>
            <Suspense fallback={<OrderItemsSkeleton />}>
              <OrderItems />
            </Suspense>
          </ItemGroup>
        </section>

        <section className='border-b px-4 pb-6 [&>h2]:mt-0'>
          <Typography variant='h5' render={<h2 />}>
            <span className='mr-2 inline-flex size-8 items-center justify-center rounded-lg bg-primary/10 text-sm font-semibold text-primary'>
              1
            </span>
            Shipping Address
          </Typography>

          <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
            <Suspense fallback={<AddressSelectorSkeleton />}>
              <AddressSelector />
            </Suspense>
          </div>
        </section>

        <section className='border-b px-4 pb-6 [&>h2]:mt-0'>
          <Typography variant='h5' render={<h2 />}>
            <span className='mr-2 inline-flex size-8 items-center justify-center rounded-lg bg-primary/10 text-sm font-semibold text-primary'>
              2
            </span>
            Payment Method
          </Typography>
          <div className='space-y-3'>
            <PaymentMethodSelector />
          </div>
        </section>

        <section className='border-b px-4 pb-6 [&>h2]:mt-0'>
          <Typography variant='h5' render={<h2 />}>
            <span className='mr-2 inline-flex size-8 items-center justify-center rounded-lg bg-primary/10 text-sm font-semibold text-primary'>
              3
            </span>
            Discount Code
          </Typography>
          <DiscountCodeInput />
        </section>

        <section className='px-4 [&>h2]:mt-0'>
          <Typography variant='h5' render={<h2 />}>
            Order Summary
          </Typography>

          <Suspense fallback={<CheckoutSkeleton />}>
            <Checkout />
          </Suspense>
        </section>
      </HydrateClient>
    </PageProvider>
  )
}

const title = 'Checkout'
const description =
  'Review your order and proceed to payment to complete your purchase.'
export const metadata = createMetadata({
  title,
  description,
  openGraph: {
    images: [
      `/api/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(
        description,
      )}`,
    ],
    url: `/account/cart/checkout`,
  },
})
