import { Suspense } from 'react'

import {
  VendorDetails,
  VendorDetailsSkeleton,
  VendorProducts,
  VendorProductsSkeleton,
} from '@/app/(main)/v/[id]/page.client'
import { productsCache } from '@/lib/search'
import { getQueryClient, HydrateClient, trpc } from '@/lib/trpc/rsc'

export default async function VendorPage({
  params,
  searchParams,
}: PageProps<'/v/[id]'>) {
  const { id } = await params
  const query = await productsCache.parse(searchParams)

  void getQueryClient().prefetchQuery(trpc.vendor.one.queryOptions({ id }))
  void getQueryClient().prefetchQuery(
    trpc.product.all.queryOptions({ ...query, vendorId: id }),
  )

  return (
    <HydrateClient>
      <main className='container flex-1 space-y-4 py-4'>
        <h1 className='sr-only'>Vendor Page</h1>

        <Suspense fallback={<VendorDetailsSkeleton />}>
          <VendorDetails id={id} />
        </Suspense>

        <section className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
          <h2 className='sr-only'>Vendor Products section</h2>
          <Suspense fallback={<VendorProductsSkeleton />}>
            <VendorProducts id={id} />
          </Suspense>
        </section>
      </main>
    </HydrateClient>
  )
}
