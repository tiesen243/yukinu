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

export const DeleteVariantButton: React.FC<{
  productId: string
  variantId: string
}> = ({ productId, variantId }) => {
  const trpc = useTRPC()
  const { mutate, isPending } = useMutation({
    ...trpc.product.deleteVariant.mutationOptions(),
    meta: { filter: trpc.product.one.queryFilter({ id: productId }) },
    onSuccess: () => toast.success('Variant deleted successfully'),
    onError: ({ message }) =>
      toast.error('Failed to delete variant', { description: message }),
  })

  return (
    <AlertDialog>
      <AlertDialogTrigger className='text-destructive underline-offset-4 hover:underline'>
        Delete
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to delete this variant?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. The variant will be permanently
            removed from the product.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>

          <AlertDialogAction
            variant='destructive'
            disabled={isPending}
            onClick={() => {
              mutate({ id: variantId })
            }}
          >
            {isPending ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
