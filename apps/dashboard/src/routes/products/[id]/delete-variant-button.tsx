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

import { useTRPC } from '@/lib/trpc/react'

export const DeleteVariantButton: React.FC<{ id: string }> = ({ id }) => {
  const trpc = useTRPC()
  const { mutate, isPending } = useMutation({
    ...trpc.product.deleteVariant.mutationOptions(),
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
          <AlertDialogCancel asChild>
            <Button variant='outline' disabled={isPending}>
              Cancel
            </Button>
          </AlertDialogCancel>

          <AlertDialogAction asChild>
            <Button
              variant='destructive'
              disabled={isPending}
              onClick={() => {
                mutate({ id })
              }}
            >
              {isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
