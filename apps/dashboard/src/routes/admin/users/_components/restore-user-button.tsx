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

export const RestoreUserButton: React.FC<{
  user: AllUsersOutput['users'][number]
}> = ({ user }) => {
  const trpc = useTRPC()
  const [open, setOpen] = useState(false)

  const { mutate, isPending } = useMutation({
    ...trpc.user.restore.mutationOptions(),
    onSuccess: () => {
      toast.success('User restored successfully')
      setOpen(false)
    },
    onError: ({ message }) =>
      toast.error('Failed to restore user', { description: message }),
    meta: { filter: trpc.user.all.queryFilter() },
  })

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger variant='link'>Restore</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Restore User</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to restore user &quot;{user.username}&quot;?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              mutate({ id: user.id })
            }}
            disabled={isPending}
          >
            {isPending ? 'Restoring...' : 'Restore'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
