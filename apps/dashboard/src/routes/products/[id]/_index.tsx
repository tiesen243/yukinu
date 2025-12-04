import { useQuery } from '@tanstack/react-query'

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
      <UpdateProductForm data={data} />

      <section className='mt-6 rounded-lg bg-card p-6 text-card-foreground shadow-sm'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>SKU</TableHead>
              <TableHead>Options</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.variants.map((variant) => (
              <TableRow key={variant.id}>
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
