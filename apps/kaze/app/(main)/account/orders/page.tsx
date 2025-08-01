import { Suspense } from 'react'

import {
  OrderCardSkeleton,
  OrderList,
} from '@/app/(main)/account/orders/page.client'
import { getQueryClient, HydrateClient, trpc } from '@/trpc/rsc'

export const dynamic = 'force-dynamic'

export default function AddressPage() {
  void getQueryClient().prefetchQuery(trpc.order.all.queryOptions())

  return (
    <HydrateClient>
      <section className='w-full space-y-4'>
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
