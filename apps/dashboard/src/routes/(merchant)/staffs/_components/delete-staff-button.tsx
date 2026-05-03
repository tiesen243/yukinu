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

export const DeleteStaffButton: React.FC<{
  staffId: string
  staffUsername: string
}> = ({ staffId, staffUsername }) => {
  const { trpc } = useTRPC()
  const deleteStaff = useMutation({
    ...trpc.merchant.staff.remove.mutationOptions(),
    meta: { filter: trpc.merchant.staff.all.queryFilter() },
    onSuccess: () => toast.success({ message: 'Staff deleted successfully' }),
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
            Are you sure you want to delete staff "{staffUsername}"?
          </AlertDialogTitle>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteStaff.isPending}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => deleteStaff.mutate({ userId: staffId })}
            variant='destructive'
            disabled={deleteStaff.isPending}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
