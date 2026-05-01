import type { AllUsersDto } from '@yukinu/api/identity'

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
import { Button } from '@yukinu/ui/button'
import { toast } from '@yukinu/ui/toast'

import { useTRPC } from '@/lib/trpc/react'

export const PermamentlyDeleteUserButton: React.FC<{
  user: AllUsersDto.Output['users'][number]
}> = ({ user }) => {
  const { trpc } = useTRPC()

  const { mutate, isPending } = useMutation({
    ...trpc.identity.user.permanentDelete.mutationOptions(),
    onSuccess: () =>
      toast.add({ type: 'success', title: 'User permanently deleted' }),
    onError: ({ message }) =>
      toast.add({
        type: 'error',
        title: 'Failed to permanently delete user',
        description: message,
      }),
    meta: { filter: trpc.identity.user.all.queryFilter() },
  })

  return (
    <AlertDialog>
      <AlertDialogTrigger
        render={<Button variant='link' className='text-destructive' />}
      >
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
