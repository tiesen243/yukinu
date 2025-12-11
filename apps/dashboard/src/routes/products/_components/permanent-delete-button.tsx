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

export const PermanentDeleteProductButton: React.FC<{
  productId: string
}> = ({ productId }) => {
  const trpc = useTRPC()

  const { mutate, isPending } = useMutation({
    ...trpc.product.permanentDelete.mutationOptions(),
    onSuccess: () => toast.success('Product permanently deleted'),
    onError: ({ message }) =>
      toast.error('Failed to delete product', { description: message }),
    meta: {
      filter: trpc.product.all.queryFilter(),
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
