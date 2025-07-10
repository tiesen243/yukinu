import { Suspense } from 'react'

import type { Props } from './page.lib'
import { ProductCardSkeleton } from '@/app/_components/product-card'
import { getQueryClient, HydrateClient, trpc } from '@/trpc/rsc'
import { PaginationSearch, ProductList, SearchProduct } from './page.client'
import { cacheSearch } from './page.lib'

export default async function SearchPage(props: Readonly<Props>) {
  const searchParams = await cacheSearch.parse(props.searchParams)

  void getQueryClient().ensureQueryData(
    trpc.product.all.queryOptions(searchParams),
  )

  return (
    <HydrateClient>
      <main className="container py-4">
        <SearchProduct />

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
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
