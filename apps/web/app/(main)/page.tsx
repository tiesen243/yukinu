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

        <section className='relative flex aspect-video w-full items-center justify-center overflow-x-hidden rounded-xl shadow-lg md:aspect-5/1'>
          <h2 className='sr-only'>Banners section</h2>
          <Suspense
            fallback={
              <div className='h-full w-full animate-pulse rounded-xl bg-muted-foreground' />
            }
          >
            <BannersList />
          </Suspense>
        </section>

        <section className='mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-3 md:grid-rows-2'>
          <Typography variant='h2' className='col-span-full row-span-full mb-0'>
            Featured Products
          </Typography>
          <Suspense fallback={<ProductsListSkeleton />}>
            <ProductsList />
          </Suspense>
        </section>

        <section className='mt-8 grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6'>
          <Typography variant='h2' className='col-span-full mb-0'>
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
