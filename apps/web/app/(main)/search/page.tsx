import {
  ProductsSearchPagination,
  ProductsSearchResults,
} from '@/app/(main)/search/page.client'
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
