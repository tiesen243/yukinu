import * as React from 'react'
import { useQuery } from '@tanstack/react-query'
import { parseAsInteger, parseAsString, useQueryStates } from 'nuqs'
import { Link } from 'react-router'

import type { ProductModels } from '@yukinu/validators/product'
import { useSession } from '@yukinu/auth/react'
import { Badge } from '@yukinu/ui/badge'
import { Button } from '@yukinu/ui/button'
import { ChevronLeftIcon, ChevronRightIcon } from '@yukinu/ui/icons'
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@yukinu/ui/table'

import { useTRPC } from '@/trpc/react'

function useProductTable() {
  const trpc = useTRPC()
  const { session } = useSession()

  const [query, setQuery] = useQueryStates({
    search: parseAsString.withDefault(''),
    page: parseAsInteger.withDefault(1),
    limit: parseAsInteger.withDefault(10),
  })

  const { data, isLoading } = useQuery(
    session.user?.role === 'admin'
      ? trpc.product.all.queryOptions(query)
      : trpc.product.allByVendor.queryOptions(query),
  )

  const handlePagination = React.useCallback(
    async (newPage: number) => setQuery({ ...query, page: newPage }),
    [query, setQuery],
  )

  return {
    query,
    data,
    isLoading,
    handlePagination,
  }
}

export const ProductTable: React.FC = () => (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead className='w-52'>ID</TableHead>
        <TableHead>Name</TableHead>
        <TableHead>Price</TableHead>
        <TableHead>Stock</TableHead>
        <TableHead>Status</TableHead>
        <TableHead className='min-w-32'>Actions</TableHead>
      </TableRow>
    </TableHeader>

    <TableBody>
      <ProductTableBody />
    </TableBody>

    <TableFooter className='bg-transparent'>
      <ProductTableFooter />
    </TableFooter>
  </Table>
)

const ProductTableBody: React.FC = () => {
  const { data, query, isLoading } = useProductTable()

  if (isLoading)
    return Array.from({ length: query.limit }, (_, index) => (
      <TableRow key={index}>
        {Array.from({ length: 6 }, (_, index) => (
          <TableCell key={index}>
            <div className='animate-pulse rounded-sm bg-accent'>&nbsp;</div>
          </TableCell>
        ))}
      </TableRow>
    ))

  if (!data?.products || data.products.length === 0)
    return (
      <TableRow>
        <TableCell colSpan={8} className='text-center'>
          No products found.
        </TableCell>
      </TableRow>
    )

  const statusMap = {
    active: 'success',
    inactive: 'warning',
    out_of_stock: 'destructive',
  } as const satisfies Record<
    ProductModels.ProductStatus,
    'success' | 'warning' | 'destructive'
  >

  return data.products.map((product) => (
    <TableRow key={product.id}>
      <TableCell>{product.id}</TableCell>
      <TableCell className='w-full'>{product.name}</TableCell>
      <TableCell>{product.price}</TableCell>
      <TableCell>{product.stock}</TableCell>
      <TableCell>
        <Badge variant={statusMap[product.status]}>{product.status}</Badge>
      </TableCell>
      <TableCell>
        <Button variant='outline' size='sm' asChild>
          <Link to={`/products/${product.id}`}>Edit</Link>
        </Button>
      </TableCell>
    </TableRow>
  ))
}

const ProductTableFooter: React.FC = () => {
  const { data, isLoading, handlePagination } = useProductTable()
  if (isLoading || !data?.pagination) return null

  const { page, totalPages } = data.pagination

  return (
    <TableRow>
      <TableCell colSpan={8}>
        <div className='flex items-center justify-end gap-4'>
          <Button
            variant='outline'
            size='sm'
            disabled={page <= 1}
            onClick={() => handlePagination(page - 1)}
          >
            <ChevronLeftIcon />
            <span className='sr-only'>Previous</span>
          </Button>
          <span>
            Page {page} of {totalPages}
          </span>
          <Button
            variant='outline'
            size='sm'
            disabled={page >= totalPages}
            onClick={() => handlePagination(page + 1)}
          >
            <ChevronRightIcon />
            <span className='sr-only'>Next</span>
          </Button>
        </div>
      </TableCell>
    </TableRow>
  )
}
