import { Suspense } from 'react'

import { productsCache } from '@/app/(main)/search/page.lib'
import {
  VendorDetails,
  VendorDetailsSkeleton,
  VendorProducts,
  VendorProductsSkeleton,
} from '@/app/(main)/v/[id]/page.client'
import { createMetadata } from '@/lib/metadata'
import { getQueryClient, HydrateClient, trpc } from '@/lib/trpc.rsc'

export default async function VendorPage({
  params,
  searchParams,
}: PageProps<'/v/[id]'>) {
  const { id } = await params
  const query = await productsCache.parse(searchParams)

  void getQueryClient().prefetchQuery(
    trpc.catalog.product.all.queryOptions({ ...query, vendorId: id }),
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

export const generateMetadata = async ({ params }: PageProps<'/v/[id]'>) => {
  const { id } = await params
  const data = await getQueryClient().ensureQueryData(
    trpc.merchant.vendor.one.queryOptions({ id }),
  )

  return createMetadata({
    title: data.name,
    description: data.description ?? `Vendor page of ${data.name}`,
    openGraph: {
      images: [
        ...(data.image ? [data.image] : []),
        `/api/og?title=${encodeURIComponent(
          data.name,
        )}&description=${encodeURIComponent(
          data.description ?? '',
        )}&image=${encodeURIComponent(data.image ?? '')}`,
      ],
      url: `/v/${data.id}`,
    },
  })
}
