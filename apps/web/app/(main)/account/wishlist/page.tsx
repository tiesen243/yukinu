import { Suspense } from 'react'

import {
  WishlistItems,
  WishlistItemsSkeleton,
} from '@/app/(main)/account/wishlist/page.client'
import { getQueryClient, HydrateClient, trpc } from '@/lib/trpc/rsc'

export const dynamic = 'force-dynamic'

export default function AccountWishlistPage() {
  void getQueryClient().prefetchQuery(trpc.user.wishlist.queryOptions({}))

  return (
    <HydrateClient>
      <main className='container flex-1 py-6'>
        <section className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
          <Suspense fallback={<WishlistItemsSkeleton />}>
            <WishlistItems />
          </Suspense>
        </section>
      </main>
    </HydrateClient>
  )
}
