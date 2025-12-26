import { useMutation, useQuery } from '@tanstack/react-query'
import { cn } from '@yukinu/ui'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@yukinu/ui/alert-dialog'
import { Badge } from '@yukinu/ui/badge'
import { Button } from '@yukinu/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@yukinu/ui/dialog'
import { Field, FieldGroup, FieldLabel } from '@yukinu/ui/field'
import { Label } from '@yukinu/ui/label'
import { NativeSelect, NativeSelectOption } from '@yukinu/ui/native-select'
import { RadioGroup, RadioGroupItem } from '@yukinu/ui/radio-group'
import { toast } from '@yukinu/ui/sonner'
import { TableCell, TableRow } from '@yukinu/ui/table'
import { UserValidators } from '@yukinu/validators/user'
import { Activity, useState } from 'react'

import { useTRPC } from '@/lib/trpc/react'
import { useUserQueryStates } from '@/routes/admin/users/hook'

export const UsersList: React.FC = () => {
  const trpc = useTRPC()
  const [query] = useUserQueryStates()

  const { data, isLoading } = useQuery(
    trpc.user.all.queryOptions({
      ...query,
      role: query.role ?? null,
    }),
  )

  if (isLoading)
    return Array.from({ length: 5 }, (_, index) => (
      <TableRow key={index}>
        {Array.from({ length: 9 }, (_, cellIndex) => (
          <TableCell key={cellIndex}>
            <div className='animate-pulse rounded bg-muted/50'>&nbsp;</div>
          </TableCell>
        ))}
      </TableRow>
    ))

  const statusVariantMap = {
    active: 'success',
    inactive: 'destructive',
  } as const

  return data?.users.map((user) => (
    <TableRow key={user.id}>
      <TableCell>{user.id}</TableCell>
      <TableCell>{user.username}</TableCell>
      <TableCell>{user.email}</TableCell>
      <TableCell>{user.role.split('_').join(' ')}</TableCell>
      <TableCell>
        <Badge variant={statusVariantMap[user.status]}>{user.status}</Badge>
      </TableCell>
      <TableCell>{user.emailVerified?.toLocaleDateString()}</TableCell>
      <TableCell>{user.createdAt.toLocaleDateString()}</TableCell>
      <TableCell>{user.updatedAt.toLocaleDateString()}</TableCell>
      <TableCell>{user.deletedAt?.toLocaleDateString() ?? 'N/A'}</TableCell>
      <TableCell className='space-x-2'>
        <Activity mode={user.deletedAt ? 'visible' : 'hidden'}>
          <RestoreUserButton user={user} />
          <PermamentlyDeleteUserButton user={user} />
        </Activity>

        <Activity mode={user.deletedAt ? 'hidden' : 'visible'}>
          <EditUserButton user={user} />
          <DeleteUserButton user={user} />
        </Activity>
      </TableCell>
    </TableRow>
  ))
}

const EditUserButton: React.FC<{
  user: UserValidators.AllOutput['users'][number]
}> = ({ user }) => {
  const trpc = useTRPC()
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState(user.status)
  const [role, setRole] = useState(user.role)

  const { mutate, isPending } = useMutation({
    ...trpc.user.update.mutationOptions(),
    onSuccess: () => {
      toast.success('User updated successfully')
      setOpen(false)
    },
    onError: ({ message }) =>
      toast.error('Failed to update user', { description: message }),
    meta: { filter: trpc.user.all.queryFilter() },
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger variant='link'>Edit</DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>
            Modify the role and status of the user.
          </DialogDescription>
        </DialogHeader>

        <FieldGroup>
          <Field>
            <FieldLabel htmlFor='role'>Role</FieldLabel>
            <NativeSelect
              id='role'
              value={role}
              onChange={(e) => {
                setRole(e.target.value as UserValidators.Role)
              }}
            >
              {UserValidators.roles.map((role) => (
                <NativeSelectOption key={role} label={role} value={role} />
              ))}
            </NativeSelect>
          </Field>

          <Field>
            <FieldLabel>Status</FieldLabel>
            <RadioGroup value={status} onValueChange={setStatus as never}>
              {UserValidators.statuses.map((status) => (
                <Label
                  key={status}
                  htmlFor={status}
                  className={cn(
                    'flex cursor-pointer items-center space-x-2 rounded-md border border-current/40 bg-current/5 px-2 py-4 capitalize transition-colors hover:bg-current/10',
                    {
                      'text-success': status === 'active',
                      'text-destructive': status === 'inactive',
                    },
                  )}
                >
                  <RadioGroupItem id={status} value={status} /> {status}
                </Label>
              ))}
            </RadioGroup>
          </Field>
        </FieldGroup>

        <DialogFooter>
          <DialogClose disabled={isPending}>Cancel</DialogClose>
          <Button
            onClick={() => {
              mutate({ id: user.id, status, role })
            }}
            disabled={isPending}
          >
            {isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

const DeleteUserButton: React.FC<{
  user: UserValidators.AllOutput['users'][number]
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

const RestoreUserButton: React.FC<{
  user: UserValidators.AllOutput['users'][number]
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

const PermamentlyDeleteUserButton: React.FC<{
  user: UserValidators.AllOutput['users'][number]
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
