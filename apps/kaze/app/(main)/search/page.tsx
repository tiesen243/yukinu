import { Suspense } from 'react'

import type { Props } from '@/app/(main)/search/page.lib'
import { ProductCardSkeleton } from '@/app/_components/product-card'
import {
  PaginationSearch,
  ProductList,
  SearchProduct,
} from '@/app/(main)/search/page.client'
import { cacheSearch } from '@/app/(main)/search/page.lib'
import { getQueryClient, HydrateClient, trpc } from '@/trpc/rsc'

export default async function SearchPage({ searchParams }: Readonly<Props>) {
  const options = await cacheSearch.parse(searchParams)
  void getQueryClient().ensureQueryData(trpc.product.all.queryOptions(options))

  return (
    <HydrateClient>
      <main className='container py-4'>
        <SearchProduct />

        <section className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
          <Suspense
            fallback={Array.from({ length: 12 }, (_, idx) => (
              <ProductCardSkeleton key={idx} />
            ))}
          >
            <ProductList />
          </Suspense>
        </section>

        <PaginationSearch />
      </main>
    </HydrateClient>
  )
}
