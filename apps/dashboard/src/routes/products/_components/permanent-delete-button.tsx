import { useMutation } from '@tanstack/react-query'
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
import { toast } from '@yukinu/ui/toast'

import { useTRPC } from '@/lib/trpc/react'

export const PermanentDeleteProductButton: React.FC<{
  productId: string
  isAdmin?: boolean
}> = ({ productId, isAdmin }) => {
  const { trpc } = useTRPC()

  const { mutate, isPending } = useMutation({
    ...trpc.catalog.product.permanentDelete.mutationOptions(),
    onSuccess: () =>
      toast.add({
        type: 'success',
        title: 'Product permanently deleted',
      }),
    onError: ({ message }) =>
      toast.add({
        type: 'error',
        title: 'Failed to permanently delete product',
        description: message,
      }),
    meta: {
      filter: isAdmin
        ? trpc.catalog.product.all.queryFilter()
        : trpc.catalog.product.allByVendor.queryFilter(),
    },
  })

  return (
    <AlertDialog>
      <AlertDialogTrigger
        render={<Button variant='link' className='text-destructive' />}
      >
        Delete
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to permanently delete this product?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action is irreversible. The product will be permanently deleted
            and cannot be restored.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant='destructive'
            onClick={() => mutate({ id: productId })}
            disabled={isPending}
          >
            {isPending ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
