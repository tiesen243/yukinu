import { useQuery } from '@tanstack/react-query'
import { Loader2Icon } from '@yukinu/ui/icons'
import { Typography } from '@yukinu/ui/typography'

import { useTRPC } from '@/lib/trpc'
import { SaveProductForm } from '@/routes/(catalog)/products/_components/save-product-form'

import type { Route } from './+types/[id]'

export default function CatalogProductsIDPage({
  params,
}: Route.ComponentProps) {
  const { trpc } = useTRPC()
  const { data, isLoading } = useQuery(
    trpc.catalog.product.one.queryOptions({ id: params.id }),
  )

  return (
    <>
      <Typography variant='h2'>Edit Product</Typography>
      <Typography className='text-muted-foreground'>
        Edit the details of the product below. You can update the name,
        description, price, category, and inventory details to keep your catalog
        organized and up-to-date.
      </Typography>

      {isLoading && (
        <div className='my-4 flex h-64 animate-pulse flex-col items-center justify-center gap-2 rounded-lg border border-dashed bg-card/10'>
          <Loader2Icon className='animate-spin text-muted-foreground' />
          <Typography className='text-muted-foreground'>
            Loading product details...
          </Typography>
        </div>
      )}

      {!isLoading && !data && (
        <div className='my-4 flex h-64 flex-col items-center justify-center gap-2 rounded-lg border border-dashed bg-destructive/10'>
          <Typography className='text-destructive'>
            Failed to load product details. Please try again later.
          </Typography>
        </div>
      )}

      {data && <SaveProductForm product={data} />}
    </>
  )
}
