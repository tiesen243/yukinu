import { useMutation } from '@tanstack/react-query'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogTitle,
  AlertDialogHeader,
  AlertDialogTrigger,
} from '@yukinu/ui/alert-dialog'
import { Button } from '@yukinu/ui/button'
import { toast } from '@yukinu/ui/toast'
import { useState } from 'react'

import { useTRPC } from '@/lib/trpc'

export const UserButton: React.FC<{
  userId: string
  username: string
  type: 'restore' | 'delete' | 'permanentDelete'
  variant: 'default' | 'destructive'
}> = ({ userId, username, type, variant }) => {
  const { trpc } = useTRPC()
  const [isOpen, setIsOpen] = useState(false)

  const label = type
    .replaceAll(/([A-Z])/g, ' $1')
    .replace(/^./, (c) => c.toUpperCase())
    .trim()

  const mutation = useMutation({
    ...trpc.identity.user[type].mutationOptions(),
    meta: {
      filter: trpc.identity.user.all.queryFilter(),
    },
    onSuccess: () => [
      toast.success({ message: `User ${label.toLowerCase()}d successfully` }),
      setIsOpen(false),
    ],
    onError: toast.error,
  })

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger render={<Button variant={variant} />}>
        {label}
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to {label} user: {username}?
          </AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={mutation.isPending}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            variant={variant}
            onClick={() => mutation.mutate({ id: userId })}
            disabled={mutation.isPending}
          >
            {label}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
