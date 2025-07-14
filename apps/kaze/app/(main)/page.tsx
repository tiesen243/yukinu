import { Suspense } from 'react'

import { ProductCardSkeleton } from '@/app/_components/product-card'
import { ProductList, Slider } from '@/app/(main)/page.client'
import { getQueryClient, trpc } from '@/trpc/rsc'

export const dynamic = 'force-dynamic'

export default function HomePage() {
  void getQueryClient().prefetchQuery(
    trpc.product.all.queryOptions({ limit: 12 }),
  )

  return (
    <main className='grow space-y-4 pb-4'>
      <section>
        <h2 className='sr-only'>Featured Products</h2>
        <Slider />
      </section>

      <section className='container grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
        <h2 className='sr-only'>Products</h2>
        <Suspense
          fallback={Array.from({ length: 12 }, (_, idx) => (
            <ProductCardSkeleton key={idx} />
          ))}
        >
          <ProductList />
        </Suspense>
      </section>
    </main>
  )
}
