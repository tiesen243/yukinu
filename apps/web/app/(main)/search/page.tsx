import {
  AdditionalInfo,
  FilterForm,
  FilterFormMobile,
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
    <main className='container flex flex-1 flex-col gap-6 py-6 md:flex-row'>
      <h1 className='sr-only'>Search Products page</h1>

      <aside className='hidden shrink-0 rounded-xl bg-card p-6 text-card-foreground shadow-sm md:block md:w-1/4 dark:border'>
        <h2 className='sr-only'>Search Filters section</h2>
        <FilterForm />
      </aside>

      <FilterFormMobile />

      <section className='flex flex-1 flex-col gap-6'>
        <h2 className='sr-only'>Search Results section</h2>

        <AdditionalInfo />

        <section className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
          <h3 className='sr-only'>Products Search Results</h3>

          <ProductsSearchResults />
        </section>

        <ProductsSearchPagination />
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
