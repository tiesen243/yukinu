import { useQuery } from '@tanstack/react-query'

import { Typography } from '@yuki/ui/typography'

import { ProductTable } from '@/components/products/table'
import { useTRPC } from '@/trpc/react'

export default function AllProductsPage() {
  const { trpc } = useTRPC()
  const { data = [], isLoading } = useQuery(
    trpc.seller.product.all.queryOptions({
      isCurrentUser: false,
    }),
  )

  return (
    <main className='container py-4'>
      <Typography variant='h4' component='h1' className='mb-4'>
        All Products
      </Typography>
      <ProductTable products={data} isLoading={isLoading} />
    </main>
  )
}
