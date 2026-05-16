import { Typography } from '@yukinu/ui/typography'
import { Suspense } from 'react'

import {
  BannersList,
  BannersListSkeleton,
} from '@/app/(main)/(home)/_components/banner-list'
import {
  CategoriesListSkeleton,
  CategoriesList,
} from '@/app/(main)/(home)/_components/categories-list'
import {
  ProductsList,
  ProductsListSkeleton,
} from '@/app/(main)/(home)/_components/product-list'
import { getQueryClient, HydrateClient, trpc } from '@/lib/trpc.rsc'

export default function Home() {
  const queryClient = getQueryClient()

  void Promise.all([
    queryClient.prefetchQuery(trpc.sales.banner.all.queryOptions()),
    queryClient.prefetchQuery(
      trpc.catalog.product.all.queryOptions({
        categoryId: null,
        vendorId: null,
        limit: 6,
      }),
    ),
    queryClient.prefetchQuery(
      trpc.catalog.category.all.queryOptions({
        isTopLevelOnly: true,
        limit: 12,
      }),
    ),
  ])

  return (
    <HydrateClient>
      <main className='container flex min-h-screen flex-col gap-4 py-4'>
        <h1 className='sr-only'>Home Page</h1>

        <section className='relative flex aspect-video w-full items-center justify-center overflow-x-hidden rounded-xl shadow-lg md:aspect-5/1'>
          <h2 className='sr-only'>Banners section</h2>
          <Suspense fallback={<BannersListSkeleton />}>
            <BannersList />
          </Suspense>
        </section>

        <section className='grid gap-4 sm:grid-cols-2 md:grid-cols-3 md:grid-rows-2'>
          <Typography variant='h2' className='col-span-full row-span-full mb-0'>
            Featured Products
          </Typography>
          <Suspense fallback={<ProductsListSkeleton />}>
            <ProductsList />
          </Suspense>
        </section>

        <section className='grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6'>
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
