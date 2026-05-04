import type { OneProductDto } from '@yukinu/api/catalog'

import { useMutation } from '@tanstack/react-query'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@yukinu/ui/alert-dialog'
import { Button } from '@yukinu/ui/button'
import { toast } from '@yukinu/ui/toast'

import { useTRPC } from '@/lib/trpc'

export const DeleteVariantButton: React.FC<{
  productId: string
  variant: OneProductDto.Output['variants'][number]
}> = ({ productId, variant }) => {
  const { trpc } = useTRPC()

  const deleteVariant = useMutation({
    ...trpc.catalog.variant.delete.mutationOptions(),
    meta: { filter: trpc.catalog.product.one.queryFilter({ id: productId }) },
    onSuccess: () => toast.success({ message: 'Variant deleted successfully' }),
    onError: toast.error,
  })

  return (
    <AlertDialog>
      <AlertDialogTrigger render={<Button variant='destructive' />}>
        Delete
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to delete this variant?
          </AlertDialogTitle>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant='destructive'
            onClick={() => deleteVariant.mutate({ id: variant.id })}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
