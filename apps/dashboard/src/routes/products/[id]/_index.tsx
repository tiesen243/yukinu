import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router'

import { buttonVariants } from '@yukinu/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@yukinu/ui/table'

import type { Route } from './+types/_index'
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
      <h1 className='sr-only'>Update Product page</h1>

      <UpdateProductForm data={data} />

      <section className='mt-6 rounded-lg bg-card p-6 text-card-foreground shadow-sm dark:border'>
        <div className='mb-6 flex items-center justify-between gap-4'>
          <h2 className='text-2xl font-semibold'>Product Variants</h2>
          <Link
            to={`/products/${data.id}/variant`}
            className={buttonVariants()}
          >
            Reciate New Variant
          </Link>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableCell>No.</TableCell>
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
      </section>
    </>
  )
}
