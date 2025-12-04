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
import { toast } from '@yukinu/ui/sonner'

import { useTRPC } from '@/lib/trpc/react'

export const DeleteProductButton: React.FC<{
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
