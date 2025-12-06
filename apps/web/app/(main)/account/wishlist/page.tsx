import { Suspense } from 'react'

import { AccountHeader } from '@/app/(main)/account/_components/header'
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
      <AccountHeader
        title='My Wishlist'
        description="View and manage the items you've saved to your wishlist for future reference or purchase."
      />

      <section className='grid max-h-full grid-cols-1 gap-4 overflow-y-auto px-6 pt-6 sm:grid-cols-2 lg:grid-cols-3'>
        <h2 className='sr-only'>Wishlist Items List section</h2>

        <Suspense fallback={<WishlistItemsSkeleton />}>
          <WishlistItems />
        </Suspense>
      </section>
    </HydrateClient>
  )
}
