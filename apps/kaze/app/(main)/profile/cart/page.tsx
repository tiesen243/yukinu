import { Suspense } from 'react'

import { Typography } from '@yuki/ui/typography'

import {
  CardList,
  CardListSkeleton,
} from '@/app/(main)/profile/cart/page.client'
import { getQueryClient, HydrateClient, trpc } from '@/trpc/rsc'

export const dynamic = 'force-dynamic'

export default function CartPage() {
  const queryClient = getQueryClient()
  void Promise.all([
    queryClient.prefetchQuery(trpc.cart.get.queryOptions()),
    queryClient.prefetchQuery(trpc.address.all.queryOptions()),
  ])

  return (
    <HydrateClient>
      <section className='w-full space-y-4'>
        <Typography variant='h4' component='h2'>
          Your Shopping Cart
        </Typography>

        <Suspense fallback={<CardListSkeleton />}>
          <CardList />
        </Suspense>
      </section>
    </HydrateClient>
  )
}
