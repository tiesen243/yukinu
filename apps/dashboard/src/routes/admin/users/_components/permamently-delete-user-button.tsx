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

import { useTRPC } from '@/lib/trpc/react'

export const PermamentlyDeleteUserButton: React.FC<{
  user: AllUsersOutput['users'][number]
}> = ({ user }) => {
  const trpc = useTRPC()

  const { mutate, isPending } = useMutation({
    ...trpc.user.permanentlyDelete.mutationOptions(),
    onSuccess: () => {
      toast.success('User permanently deleted successfully')
    },
    onError: ({ message }) =>
      toast.error('Failed to delete user', { description: message }),
    meta: { filter: trpc.user.all.queryFilter() },
  })

  return (
    <AlertDialog>
      <AlertDialogTrigger variant='link' className='text-destructive'>
        Delete
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Permanently Delete User</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete user &quot;{user.username}&quot;?
            This action cannot be undone.
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
