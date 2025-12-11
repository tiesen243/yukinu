import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router'

import { TableCell, TableRow } from '@yukinu/ui/table'

import { useTRPC } from '@/lib/trpc/react'
import { DeleteProductButton } from '@/routes/products/_components/delete-product-button'
import { PermanentDeleteProductButton } from '@/routes/products/_components/permanent-delete-button'
import { RestoreProductButton } from '@/routes/products/_components/restore-product-button'
import { useProductQueryStates } from '@/routes/products/_hook'

export const ProductsList: React.FC<{ isAdmin?: boolean }> = ({ isAdmin }) => {
  const trpc = useTRPC()
  const [query] = useProductQueryStates()

  const queryOptions = isAdmin
    ? trpc.product.all.queryOptions
    : trpc.product.allByVendor.queryOptions
  const { data, isLoading } = useQuery(queryOptions(query))

  if (isLoading)
    return Array.from({ length: 5 }, (_, index) => (
      <TableRow key={index}>
        {Array.from({ length: 9 }, (_, cellIndex) => (
          <TableCell key={cellIndex}>
            <div className='animate-pulse rounded bg-muted/50'>&nbsp;</div>
          </TableCell>
        ))}
      </TableRow>
    ))

  return data?.products.map((product) => (
    <TableRow key={product.id}>
      <TableCell>{product.id}</TableCell>
      <TableCell>{product.name}</TableCell>
      <TableCell>{product.category}</TableCell>
      <TableCell>{product.sold}</TableCell>
      <TableCell>{product.rating}</TableCell>
      <TableCell>{product.price}</TableCell>
      <TableCell>{product.createdAt.toLocaleDateString()}</TableCell>
      <TableCell>
        {!query.isDeleted
          ? product.updatedAt.toLocaleDateString()
          : product.deletedAt?.toLocaleDateString()}
      </TableCell>
      <TableCell className='space-x-2'>
        {!isAdmin && !query.isDeleted && (
          <Link
            to={`/products/${product.id}`}
            className='text-primary underline-offset-4 hover:underline'
          >
            Edit
          </Link>
        )}

        {query.isDeleted ? (
          <>
            <RestoreProductButton productId={product.id} isAdmin={isAdmin} />
            <PermanentDeleteProductButton
              productId={product.id}
              isAdmin={isAdmin}
            />
          </>
        ) : (
          <DeleteProductButton productId={product.id} isAdmin={isAdmin} />
        )}
      </TableCell>
    </TableRow>
  ))
}
