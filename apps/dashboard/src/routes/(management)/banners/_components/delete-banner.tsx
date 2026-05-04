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

export const DeleteBanner: React.FC<{
  bannerId: string
}> = ({ bannerId }) => {
  const { trpc } = useTRPC()
  const deleteBanner = useMutation({
    ...trpc.sales.banner.delete.mutationOptions(),
    meta: { filter: trpc.sales.banner.all.queryFilter() },
    onSuccess: () => toast.success({ message: 'Banner deleted successfully' }),
    onError: ({ message }) => toast.error({ message }),
  })

  return (
    <AlertDialog>
      <AlertDialogTrigger render={<Button variant='destructive' />}>
        Delete
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to delete this banner? This action cannot be
            undone.
          </AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteBanner.isPending}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            variant='destructive'
            disabled={deleteBanner.isPending}
            onClick={() => deleteBanner.mutate({ id: bannerId })}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
