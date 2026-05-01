import { useQuery } from '@tanstack/react-query'
import { Button } from '@yukinu/ui/button'
import { Card } from '@yukinu/ui/card'
import { DownloadIcon, PlusIcon } from '@yukinu/ui/icons'
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@yukinu/ui/table'
import { Link } from 'react-router'

import { exportCsv } from '@/lib/export-csv'
import { useTRPC } from '@/lib/trpc/react'
import { useProductQueryStates } from '@/routes/products/_components/hook'
import { ProductsList } from '@/routes/products/_components/products-list'
import { ProductsPagination } from '@/routes/products/_components/products-pagination'
import {
  SearchForm,
  ToggleProductStatusButton,
} from '@/routes/products/_components/search-form'

export function ProductTable({ isAdmin }: { isAdmin?: boolean }) {
  const { trpc } = useTRPC()

  const [query] = useProductQueryStates()
  const queryOptions = isAdmin
    ? trpc.catalog.product.all.queryOptions
    : trpc.catalog.product.allByVendor.queryOptions
  const { data, isLoading } = useQuery(
    queryOptions({
      ...query,
      categoryId: query.categoryId ?? undefined,
    }),
  )

  return (
    <>
      <div className='my-4 flex items-center justify-between gap-4'>
        <SearchForm />

        <div className='flex-1' />

        {!isAdmin && (
          <Button
            variant='outline'
            nativeButton={false}
            render={
              <Link to='/products/new'>
                <PlusIcon />
                <span className='sr-only md:not-sr-only'>Add Product</span>
              </Link>
            }
          />
        )}

        <ToggleProductStatusButton />

        <Button
          variant='outline'
          onClick={() => exportCsv('products', data?.products ?? [])}
          disabled={isLoading || !data?.products.length}
        >
          <DownloadIcon />
          <span className='sr-only md:not-sr-only'>Export</span>
        </Button>
      </div>

      <Card className='px-4' render={<section />}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Sold</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>
                {query.isDeleted ? 'Deleted At' : 'Updated At'}
              </TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            <ProductsList isAdmin={isAdmin} />
          </TableBody>
        </Table>

        <ProductsPagination isAdmin={isAdmin} />
      </Card>
    </>
  )
}
