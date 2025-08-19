import type { Route } from '@react-router/types/_dashboard.products.new'

import { CreateProductForm } from '@/components/products/create-form'
import { createTRPC, getQueryClient } from '@/trpc/rsc'

export const loader = async ({ request }: Route.LoaderArgs) => {
  const trpc = createTRPC({ headers: request.headers })
  const categories = await getQueryClient().ensureQueryData(
    trpc.seller.category.all.queryOptions(),
  )
  return { categories }
}

export default function NewProductPage({ loaderData }: Route.ComponentProps) {
  return (
    <main className='container py-4'>
      <CreateProductForm categories={loaderData.categories} />
    </main>
  )
}
