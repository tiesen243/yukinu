import { Suspense } from 'react'

import {
  OrderCardSkeleton,
  OrderList,
} from '@/app/(main)/profile/orders/page.client'
import { getQueryClient, HydrateClient, trpc } from '@/trpc/rsc'

export const dynamic = 'force-dynamic'

export default function AddressPage() {
  void getQueryClient().prefetchQuery(trpc.order.getUserOrders.queryOptions())

  return (
    <HydrateClient>
      <section className='grid w-full gap-4'>
        <Suspense
          fallback={Array.from({ length: 3 }, (_, index) => (
            <OrderCardSkeleton key={index} />
          ))}
        >
          <OrderList />
        </Suspense>
      </section>
    </HydrateClient>
  )
}
