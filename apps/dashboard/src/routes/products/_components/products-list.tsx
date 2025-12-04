import { useMutation, useQuery } from '@tanstack/react-query'
import { Link } from 'react-router'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@yukinu/ui/alert-dialog'
import { Button } from '@yukinu/ui/button'
import { toast } from '@yukinu/ui/sonner'
import { TableCell, TableRow } from '@yukinu/ui/table'

import { useTRPC } from '@/lib/trpc/react'
import { useProductQueryStates } from '@/routes/products/_hook'

export const ProductsList: React.FC<{ isAdmin?: boolean }> = ({ isAdmin }) => {
  const trpc = useTRPC()
  const [query] = useProductQueryStates()

  const queryOptions = isAdmin
    ? trpc.product.all.queryOptions
    : trpc.product.allByVendor.queryOptions
  const { data, isLoading } = useQuery(
    queryOptions({ ...query, isDeleted: query.status === 'inactive' }),
  )

  if (isLoading)
    return Array.from({ length: 5 }, (_, index) => (
      <TableRow key={index}>
        {Array.from({ length: 7 }, (_, cellIndex) => (
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
      <TableCell>{new Date(product.createdAt).toLocaleDateString()}</TableCell>
      <TableCell>{new Date(product.updatedAt).toLocaleDateString()}</TableCell>
      <TableCell>
        <Button variant='link'>
          <Link to={`/products/${product.id}`}>Edit</Link>
        </Button>

        {query.status === 'inactive' ? (
          <RestoreProductButton productId={product.id} isAdmin={isAdmin} />
        ) : (
          <DeleteProductButton productId={product.id} isAdmin={isAdmin} />
        )}
      </TableCell>
    </TableRow>
  ))
}

const DeleteProductButton: React.FC<{
  productId: string
  isAdmin?: boolean
}> = ({ productId, isAdmin }) => {
  const trpc = useTRPC()

  const { mutate, isPending } = useMutation({
    ...trpc.product.delete.mutationOptions(),
    onSuccess: () => toast.success('Product deleted successfully'),
    onError: ({ message }) =>
      toast.error('Failed to delete product', { description: message }),
    meta: {
      filter: isAdmin
        ? trpc.product.all.queryFilter()
        : trpc.product.allByVendor.queryFilter(),
    },
  })

  return (
    <AlertDialog>
      <AlertDialogTrigger className='text-destructive underline-offset-4 hover:underline'>
        Delete
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to delete this product?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant='outline' disabled={isPending}>
              Cancel
            </Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              onClick={() => {
                mutate({ id: productId })
              }}
              disabled={isPending}
              variant='destructive'
            >
              {isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

const RestoreProductButton: React.FC<{
  productId: string
  isAdmin?: boolean
}> = ({ productId, isAdmin }) => {
  const trpc = useTRPC()

  const { mutate, isPending } = useMutation({
    ...trpc.product.restore.mutationOptions(),
    onSuccess: () => toast.success('Product restored successfully'),
    onError: ({ message }) =>
      toast.error('Failed to restore product', { description: message }),
    meta: {
      filter: isAdmin
        ? trpc.product.all.queryFilter()
        : trpc.product.allByVendor.queryFilter(),
    },
  })

  return (
    <AlertDialog>
      <AlertDialogTrigger className='text-primary underline-offset-4 hover:underline'>
        Restore
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to restore this product?
          </AlertDialogTitle>
          <AlertDialogDescription>
            The product will be available for sale again.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant='outline' disabled={isPending}>
              Cancel
            </Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              onClick={() => {
                mutate({ id: productId })
              }}
              disabled={isPending}
            >
              {isPending ? 'Restoring...' : 'Restore'}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
