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
import { useState } from 'react'

import { useTRPC } from '@/lib/trpc/react'

export const RestoreUserButton: React.FC<{
  user: AllUsersDto.Output['users'][number]
}> = ({ user }) => {
  const { trpc } = useTRPC()
  const [open, setOpen] = useState(false)

  const { mutate, isPending } = useMutation({
    ...trpc.identity.user.restore.mutationOptions(),
    onSuccess: () => {
      toast.add({
        type: 'success',
        title: 'User restored successfully',
      })
      setOpen(false)
    },
    onError: ({ message }) =>
      toast.add({
        type: 'error',
        title: 'Failed to restore user',
        description: message,
      }),
    meta: { filter: trpc.identity.user.all.queryFilter() },
  })

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger render={<Button variant='link' />}>
        Restore
      </AlertDialogTrigger>
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
