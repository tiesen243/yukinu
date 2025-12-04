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

export const RestoreProductButton: React.FC<{
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
