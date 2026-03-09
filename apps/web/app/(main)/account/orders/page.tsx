import { ItemGroup } from '@yukinu/ui/item'
import { Suspense } from 'react'

import { AccountHeader } from '@/app/(main)/account/_components/header'
import { OrderHistories } from '@/app/(main)/account/orders/page.client'
import { createMetadata } from '@/lib/metadata'
import { getQueryClient, HydrateClient, trpc } from '@/lib/trpc/rsc'

export const dynamic = 'force-dynamic'

export default function AccountOrdersPage() {
  void getQueryClient().prefetchQuery(trpc.order.all.queryOptions({}))

  return (
    <HydrateClient>
      <AccountHeader
        title='My Orders'
        description='Review your past orders, track current shipments, and manage returns or exchanges all in one place.'
      />

      <section className='px-6'>
        <h2 className='sr-only'>Orders History List section</h2>

        <ItemGroup>
          <Suspense fallback={<p>Loading...</p>}>
            <OrderHistories />
          </Suspense>
        </ItemGroup>
      </section>
    </HydrateClient>
  )
}

const title = 'My Orders'
const description =
  'Review your past orders, track current shipments, and manage returns or exchanges all in one place.'
export const metadata = createMetadata({
  title,
  description,
  openGraph: {
    images: [
      `/api/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(
        description,
      )}`,
    ],
    url: `/account/orders`,
  },
})
