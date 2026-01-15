import type { Route } from './+types/_index'

import { useQuery } from '@tanstack/react-query'
import { Button } from '@yukinu/ui/button'
import { Card } from '@yukinu/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@yukinu/ui/table'
import { Typography } from '@yukinu/ui/typography'
import { Link } from 'react-router'

import { useTRPC } from '@/lib/trpc/react'
import { createTRPC, getQueryClient } from '@/lib/trpc/rsc'
import { DeleteVariantButton } from '@/routes/products/[id]/delete-variant-button'
import { EditVariantButton } from '@/routes/products/[id]/edit-variant-button'
import { UpdateProductForm } from '@/routes/products/[id]/update-product-form'

export const loader = ({ request, params }: Route.LoaderArgs) => {
  const trpc = createTRPC(request)
  return getQueryClient().ensureQueryData(trpc.product.one.queryOptions(params))
}

export default function ProductsUpdatePage({
  loaderData,
}: Route.ComponentProps) {
  const trpc = useTRPC()
  const { data } = useQuery({
    ...trpc.product.one.queryOptions({ id: loaderData.id }),
    initialData: loaderData,
  })

  return (
    <>
      <h2 className='sr-only'>Update Product section</h2>

      <UpdateProductForm data={data} />

      <Card className='mt-4 px-6' render={<section />}>
        <div className='flex items-center justify-between gap-4'>
          <Typography variant='h3'>Product Variants</Typography>
          <Button render={<Link to={`/products/${data.id}/variant`} />}>
            Recreate New Variant
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>No.</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Options</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.variants.map((variant, index) => (
              <TableRow key={variant.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{variant.sku}</TableCell>
                <TableCell>
                  {variant.options
                    .map((opt) => `${opt.name}: ${opt.value}`)
                    .join(', ')}
                </TableCell>
                <TableCell>${variant.price}</TableCell>
                <TableCell>{variant.stock}</TableCell>
                <TableCell className='space-x-2'>
                  <EditVariantButton productId={data.id} variant={variant} />

                  <DeleteVariantButton
                    productId={data.id}
                    variantId={variant.id}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </>
  )
}
