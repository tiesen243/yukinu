import { Suspense } from 'react'

import { AccountHeader } from '@/app/(main)/account/_components/header'
import { CartItems } from '@/app/(main)/account/cart/checkout/page.client'
import { getQueryClient, HydrateClient, trpc } from '@/lib/trpc/rsc'

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

        <Suspense>
          <CartItems />
        </Suspense>
      </section>
    </HydrateClient>
  )
}
