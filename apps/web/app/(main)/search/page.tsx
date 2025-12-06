import {
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
    <main className='container flex flex-1 flex-col gap-4 py-6'>
      <section className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
        <ProductsSearchResults />
      </section>

      <ProductsSearchPagination />
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
