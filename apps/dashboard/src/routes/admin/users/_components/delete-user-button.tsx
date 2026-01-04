import type { AllUsersOutput } from '@yukinu/validators/user'

import { useMutation } from '@tanstack/react-query'
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@yukinu/ui/alert-dialog'
import { toast } from '@yukinu/ui/sonner'
import { useState } from 'react'

import { useTRPC } from '@/lib/trpc/react'

export const DeleteUserButton: React.FC<{
  user: AllUsersOutput['users'][number]
}> = ({ user }) => {
  const trpc = useTRPC()
  const [open, setOpen] = useState(false)

  const { mutate, isPending } = useMutation({
    ...trpc.user.delete.mutationOptions(),
    onSuccess: () => {
      toast.success('User deleted successfully')
      setOpen(false)
    },
    onError: ({ message }) =>
      toast.error('Failed to delete user', { description: message }),
    meta: { filter: trpc.user.all.queryFilter() },
  })

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger variant='link' className='text-destructive'>
        Delete
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete User</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete user &quot;{user.username}&quot;?
            You can restore the user later from the deleted users section.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant='destructive'
            onClick={() => {
              mutate({ id: user.id })
            }}
            disabled={isPending}
          >
            {isPending ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
