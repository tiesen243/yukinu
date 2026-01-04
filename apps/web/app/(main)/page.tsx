import { Typography } from '@yukinu/ui/typography'
import { Suspense } from 'react'

import {
  BannersList,
  CategoriesList,
  CategoriesListSkeleton,
  ProductsList,
  ProductsListSkeleton,
} from '@/app/(main)/page.client'
import { productsCache } from '@/lib/search'
import { getQueryClient, HydrateClient, trpc } from '@/lib/trpc/rsc'

export default async function HomePage({ searchParams }: PageProps<'/'>) {
  const query = await productsCache.parse(searchParams)

  void Promise.all([
    getQueryClient().prefetchQuery(trpc.banner.all.queryOptions()),
    getQueryClient().prefetchQuery(
      trpc.product.all.queryOptions({ ...query, limit: 6 }),
    ),
    getQueryClient().prefetchQuery(
      trpc.category.all.queryOptions({
        search: '',
        isTopLevelOnly: true,
        limit: 12,
      }),
    ),
  ])

  return (
    <HydrateClient>
      <main className='container flex-1 py-4'>
        <h1 className='sr-only'>Home Page</h1>

        <section className='relative w-full aspect-video md:aspect-5/1 rounded-xl shadow-lg flex items-center justify-center overflow-x-hidden'>
          <h2 className='sr-only'>Banners section</h2>
          <Suspense
            fallback={
              <div className='w-full h-full rounded-xl bg-muted-foreground animate-pulse' />
            }
          >
            <BannersList />
          </Suspense>
        </section>

        <section className='mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-3 md:grid-rows-2'>
          <Typography variant='h2' className='mb-0 col-span-full row-span-full'>
            Featured Products
          </Typography>
          <Suspense fallback={<ProductsListSkeleton />}>
            <ProductsList />
          </Suspense>
        </section>

        <section className='mt-8 grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6'>
          <Typography variant='h2' className='mb-0 col-span-full'>
            Categories
          </Typography>

          <Suspense fallback={<CategoriesListSkeleton />}>
            <CategoriesList />
          </Suspense>
        </section>
      </main>
    </HydrateClient>
  )
}
