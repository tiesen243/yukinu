import { Suspense } from 'react'

import { Button } from '@yukinu/ui/button'
import { Card } from '@yukinu/ui/card'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@yukinu/ui/collapsible'
import { FilterIcon } from '@yukinu/ui/icons'

import {
  AdditionalInfo,
  FilterForm,
  ProductsSearchPagination,
  ProductsSearchResults,
} from '@/app/(main)/search/page.client'
import { createMetadata } from '@/lib/metadata'
import { productsCache } from '@/lib/search'

export default async function SearchPage({
  searchParams,
}: PageProps<'/search'>) {
  await productsCache.parse(searchParams)

  return (
    <main className='container flex flex-1 flex-col gap-4 py-4 md:flex-row'>
      <h1 className='sr-only'>Search Products page</h1>

      <Card
        render={<aside />}
        className='hidden shrink-0 px-4 md:block md:w-1/4'
      >
        <h2 className='sr-only'>Search Filters section</h2>
        <Suspense>
          <FilterForm />
        </Suspense>
      </Card>

      <Collapsible className='relative md:hidden'>
        <CollapsibleTrigger
          render={<Button variant='outline' className='w-full justify-start' />}
        >
          <FilterIcon /> Filters
        </CollapsibleTrigger>

        <CollapsibleContent className='absolute left-0 z-40 mt-4 w-full rounded-xl border bg-card p-4 text-card-foreground shadow-sm'>
          <Suspense>
            <FilterForm />
          </Suspense>
        </CollapsibleContent>
      </Collapsible>

      <section className='flex flex-1 flex-col gap-6'>
        <h2 className='sr-only'>Search Results section</h2>

        <AdditionalInfo />

        <section className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
          <h3 className='sr-only'>Products Search Results</h3>

          <Suspense>
            <ProductsSearchResults />
          </Suspense>
        </section>

        <Suspense>
          <ProductsSearchPagination />
        </Suspense>
      </section>
    </main>
  )
}

const title = 'Find Products Instantly'
const description =
  'Discover and search a wide range of products available in our store. Filter, browse, and find exactly what you need.'
export const metadata = createMetadata({
  title,
  description,
  openGraph: {
    images: [
      `/api/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(
        description,
      )}`,
    ],
    url: `/search`,
  },
})
