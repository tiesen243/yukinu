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
import { toast } from '@yukinu/ui/sonner'

import { useTRPC } from '@/lib/trpc/react'

export const PermanentDeleteProductButton: React.FC<{
  productId: string
  isAdmin?: boolean
}> = ({ productId, isAdmin }) => {
  const trpc = useTRPC()

  const { mutate, isPending } = useMutation({
    ...trpc.product.permanentDelete.mutationOptions(),
    onSuccess: () => toast.success('Product permanently deleted'),
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
            onClick={() => {
              mutate({ id: productId })
            }}
            disabled={isPending}
          >
            {isPending ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
