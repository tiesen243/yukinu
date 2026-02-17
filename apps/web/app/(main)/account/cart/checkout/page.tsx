import { ItemGroup } from '@yukinu/ui/item'
import { Suspense } from 'react'

import { AccountHeader } from '@/app/(main)/account/_components/header'
import { CartItems } from '@/app/(main)/account/cart/checkout/page.client'
import { createMetadata } from '@/lib/metadata'
import { getQueryClient, HydrateClient, trpc } from '@/lib/trpc/rsc'

export const dynamic = 'force-dynamic'

export default function AccountCartCheckoutPage() {
  void getQueryClient().prefetchQuery(trpc.cart.get.queryOptions())

  return (
    <HydrateClient>
      <AccountHeader
        title='Checkout'
        description='Review your order and proceed to payment to complete your purchase.'
      />

      <section className='flex h-full flex-col px-6'>
        <h2 className='sr-only'>Preview cart section</h2>

        <ItemGroup className='flex-1'>
          <Suspense fallback='Loading cart items...'>
            <CartItems />
          </Suspense>
        </ItemGroup>
      </section>
    </HydrateClient>
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
