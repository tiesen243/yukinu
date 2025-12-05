import { productsCache } from '@/lib/search'

export default async function SearchPage({
  searchParams,
}: PageProps<'/search'>) {
  const query = await productsCache.parse(searchParams)

  return (
    <main className='container flex-1 py-6'>
      <pre>{JSON.stringify(query, null, 2)}</pre>
    </main>
  )
}
