import { ItemGroup } from '@yukinu/ui/item'
import { Suspense } from 'react'

import { AccountHeader } from '@/app/(main)/account/_components/header'
import {
  OrderItems,
  OrderItemsSkeleton,
  OrderSummary,
  OrderSummarySkeleton,
  TotalAmount,
  TotalAmountSkeleton,
} from '@/app/(main)/account/orders/[id]/page.client'
import { createMetadata } from '@/lib/metadata'
import { getQueryClient, HydrateClient, trpc } from '@/lib/trpc/rsc'

export default async function OrderDetailsPage({
  params,
}: PageProps<'/account/orders/[id]'>) {
  const { id: rawId } = await params
  const id = Number.parseInt(rawId, 10)

  void getQueryClient().prefetchQuery(trpc.order.one.queryOptions({ id }))

  return (
    <HydrateClient>
      <AccountHeader
        title={`Order #${id}`}
        description={`Details for order #${id}. Review your order items, track shipment status, and manage returns or exchanges all in one place.`}
      />

      <section className='px-4'>
        <h2 className='sr-only'>Order Status section</h2>

        <Suspense fallback={<OrderSummarySkeleton />}>
          <OrderSummary id={id} />
        </Suspense>
      </section>

      <section className='flex-1 px-4'>
        <h2 className='sr-only'>Order Details section</h2>

        <ItemGroup>
          <Suspense fallback={<OrderItemsSkeleton />}>
            <OrderItems id={id} />
          </Suspense>
        </ItemGroup>
      </section>

      <section className='border-t px-4 pt-4'>
        <h2 className='sr-only'>Order Summary section</h2>

        <Suspense fallback={<TotalAmountSkeleton />}>
          <TotalAmount id={id} />
        </Suspense>
      </section>
    </HydrateClient>
  )
}

export const generateMetadata = async ({
  params,
}: PageProps<'/account/orders/[id]'>) => {
  const { id: rawId } = await params
  const id = Number.parseInt(rawId, 10)

  const title = `Order #${id}`
  const description = `Details for order #${id}. Review your order items, track shipment status, and manage returns or exchanges all in one place.`

  return createMetadata({
    title,
    description,
    openGraph: {
      images: [
        `/api/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(
          description,
        )}`,
      ],
      url: `/account/orders/${id}`,
    },
  })
}
