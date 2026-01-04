import { Suspense } from 'react'

import { AccountHeader } from '@/app/(main)/account/_components/header'
import {
  WishlistItems,
  WishlistItemsSkeleton,
} from '@/app/(main)/account/wishlist/page.client'
import { createMetadata } from '@/lib/metadata'
import { getQueryClient, HydrateClient, trpc } from '@/lib/trpc/rsc'

export const dynamic = 'force-dynamic'

export default function AccountWishlistPage() {
  void getQueryClient().prefetchQuery(trpc.wishlist.get.queryOptions({}))

  return (
    <HydrateClient>
      <AccountHeader
        title='My Wishlist'
        description="View and manage the items you've saved to your wishlist for future reference or purchase."
      />

      <section className='grid grid-cols-1 gap-4 px-4 sm:grid-cols-2 lg:grid-cols-3'>
        <h2 className='sr-only'>Wishlist Items List section</h2>

        <Suspense fallback={<WishlistItemsSkeleton />}>
          <WishlistItems />
        </Suspense>
      </section>
    </HydrateClient>
  )
}

const title = 'My Wishlist'
const description =
  "View and manage the items you've saved to your wishlist for future reference or purchase."
export const metadata = createMetadata({
  title,
  description,
  openGraph: {
    images: [
      `/api/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(
        description,
      )}`,
    ],
    url: `/account/wishlist`,
  },
})
