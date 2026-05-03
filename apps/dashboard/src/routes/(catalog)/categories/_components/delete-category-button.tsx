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

export const DeleteCategoryButton: React.FC<{
  categoryId: string
  categoryName: string
}> = ({ categoryId, categoryName }) => {
  const { trpc } = useTRPC()

  const deleteCategory = useMutation({
    ...trpc.catalog.category.delete.mutationOptions(),
    meta: {
      filter: trpc.catalog.category.all.queryFilter(),
    },
    onSuccess: () =>
      toast.success({ message: 'Category deleted successfully' }),
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
            Are you sure you want to delete the category "{categoryName}"? This
            action cannot be undone.
          </AlertDialogTitle>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteCategory.isPending}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            variant='destructive'
            onClick={() => deleteCategory.mutate({ id: categoryId })}
            disabled={deleteCategory.isPending}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
