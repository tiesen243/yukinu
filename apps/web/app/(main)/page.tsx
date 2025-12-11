import { Suspense } from 'react'

import {
  CategoriesList,
  CategoriesListSkeleton,
  ProductsList,
  ProductsListSkeleton,
} from '@/app/(main)/page.client'
import { productsCache } from '@/lib/search'
import { getQueryClient, HydrateClient, trpc } from '@/lib/trpc/rsc'

export default async function HomePage({ searchParams }: PageProps<'/'>) {
  const query = await productsCache.parse(searchParams)

  void getQueryClient().prefetchQuery(
    trpc.product.all.queryOptions({ ...query, limit: 3 }),
  )

  void getQueryClient().prefetchQuery(
    trpc.category.all.queryOptions({ search: null, istopLevelOnly: true }),
  )

  return (
    <HydrateClient>
      <main className='container flex-1 py-6'>
        <h1 className='sr-only'>Home Page</h1>

        <section className='grid gap-4 md:grid-cols-3 md:grid-rows-2'>
          <h2 className='sr-only'>New Products</h2>
          <Suspense fallback={<ProductsListSkeleton />}>
            <ProductsList />
          </Suspense>
        </section>

        <section className='mt-6'>
          <h2 className='mb-4 text-2xl font-bold'>Categories</h2>

          <div className='grid grid-cols-2 gap-4 sm:grid-cols-4 md:grid-cols-5'>
            <Suspense fallback={<CategoriesListSkeleton />}>
              <CategoriesList />
            </Suspense>
          </div>
        </section>
      </main>
    </HydrateClient>
  )
}
