import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router'

import { Button } from '@yuki/ui/button'
import { Typography } from '@yuki/ui/typography'

import { ProductTable } from '@/components/products/table'
import { useTRPC } from '@/trpc/react'

export default function ProductsPage() {
  const { trpc } = useTRPC()

  const { data = [], isLoading } = useQuery(
    trpc.seller.product.all.queryOptions({
      isCurrentUser: true,
    }),
  )

  return (
    <main className='container py-4'>
      <div className='mb-4 flex items-center justify-between'>
        <Typography variant='h4' component='h1' className='mb-0'>
          My Products
        </Typography>

        <Button>
          <Link to='/products/new'>Create Product</Link>
        </Button>
      </div>

      <ProductTable products={data} isLoading={isLoading} />
    </main>
  )
}
