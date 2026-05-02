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

export const DeleteVoucher: React.FC<{
  code: string
}> = ({ code }) => {
  const { trpc } = useTRPC()
  const deleteVoucher = useMutation({
    ...trpc.sales.voucher.delete.mutationOptions(),
    meta: { filter: trpc.sales.voucher.all.queryFilter() },
    onSuccess: () => toast.success({ message: 'Voucher deleted successfully' }),
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
            Are you sure you want to delete this voucher? This action cannot be
            undone.
          </AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteVoucher.isPending}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            variant='destructive'
            disabled={deleteVoucher.isPending}
            onClick={() => deleteVoucher.mutate({ code })}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
