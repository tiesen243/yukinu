import { Suspense } from 'react'
import { notFound } from 'next/navigation'

import { ProductDetails } from '@/app/(main)/[slug]/page.client'
import { getQueryClient, HydrateClient, trpc } from '@/lib/trpc/rsc'

export default async function ProductDetailsPage({
  params,
}: PageProps<'/[slug]'>) {
  const { slug } = await params
  const id = slug.split('-').pop()
  if (!id) return notFound()

  void getQueryClient().prefetchQuery(trpc.product.one.queryOptions({ id }))

  return (
    <HydrateClient>
      <main className='container flex-1 py-6'>
        <h1>Product {id} Details Page</h1>

        <Suspense fallback={<div>Loading product details...</div>}>
          <ProductDetails id={id} />
        </Suspense>
      </main>
    </HydrateClient>
  )
}
