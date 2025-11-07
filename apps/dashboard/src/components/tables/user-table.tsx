//#region imports

import * as React from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { parseAsInteger, parseAsString, useQueryStates } from 'nuqs'

import type { RouterOutputs } from '@yukinu/api'
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
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldSet,
} from '@yukinu/ui/field'
import { useForm } from '@yukinu/ui/hooks/use-form'
import { ChevronLeftIcon, ChevronRightIcon } from '@yukinu/ui/icons'
import { Input } from '@yukinu/ui/input'
import { RadioGroup, RadioGroupItem } from '@yukinu/ui/radio-group'
import { Select, SelectOption } from '@yukinu/ui/select'
import { toast } from '@yukinu/ui/sonner'
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@yukinu/ui/table'
import { UserValidator } from '@yukinu/validators/user'

import { useTRPC } from '@/trpc/react'

//#endregion

//#region hooks
export function useUserTable() {
  const trpc = useTRPC()

  const [query, setQuery] = useQueryStates({
    search: parseAsString.withDefault(''),
    page: parseAsInteger.withDefault(1),
    limit: parseAsInteger.withDefault(10),
  })

  const { data, isLoading, refetch } = useQuery(
    trpc.user.all.queryOptions(query),
  )
  const { mutateAsync: updateUser } = useMutation({
    ...trpc.user.update.mutationOptions(),
    onSuccess: () => {
      void refetch()
      toast.success('User updated successfully')
    },
    onError: (error) => toast.error(error.message),
  })

  const { mutate: deleteUser, isPending: isDeleting } = useMutation({
    ...trpc.user.delete.mutationOptions(),
    onSuccess: () => {
      void refetch()
      toast.success('User deleted successfully')
    },
    onError: (error) => toast.error(error.message),
  })

  const handlePagination = React.useCallback(
    async (newPage: number) => setQuery({ ...query, page: newPage }),
    [query, setQuery],
  )

  return {
    data,
    isLoading,
    query,
    handlePagination,
    updateUser,
    deleteUser,
    isDeleting,
  }
}
//#endregion

//#region user table component
export const UserTable: React.FC = () => (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead className='w-[100px]'>ID</TableHead>
        <TableHead>Username</TableHead>
        <TableHead>Email</TableHead>
        <TableHead>Role</TableHead>
        <TableHead>Status</TableHead>
        <TableHead>Created At</TableHead>
        <TableHead>Updated At</TableHead>
        <TableHead>Actions</TableHead>
      </TableRow>
    </TableHeader>

    <TableBody>
      <UserTableBody />
    </TableBody>

    <TableFooter className='bg-transparent'>
      <UserTableFooter />
    </TableFooter>
  </Table>
)

const UserTableBody: React.FC = () => {
  const { data, query, isLoading } = useUserTable()

  if (isLoading)
    return Array.from({ length: query.limit }, (_, index) => (
      <TableRow key={index}>
        {Array.from({ length: 8 }, (_, index) => (
          <TableCell key={index}>
            <div className='animate-pulse rounded-sm bg-accent'>&nbsp;</div>
          </TableCell>
        ))}
      </TableRow>
    ))

  if (!data?.users || data.users.length === 0)
    return (
      <TableRow>
        <TableCell colSpan={8} className='text-center'>
          No users found.
        </TableCell>
      </TableRow>
    )

  return data.users.map((user) => (
    <TableRow key={user.id}>
      <TableCell>{user.id}</TableCell>
      <TableCell>{user.username}</TableCell>
      <TableCell>{user.email}</TableCell>
      <TableCell>{user.role}</TableCell>
      <TableCell>
        <Badge variant={user.status === 'active' ? 'success' : 'warning'}>
          {user.status}
        </Badge>
      </TableCell>
      <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
      <TableCell>{new Date(user.updatedAt).toLocaleDateString()}</TableCell>
      <TableCell className='flex w-fit items-center gap-2'>
        <EditUserModal user={user} />
        <DeleteUserModal user={user} />
      </TableCell>
    </TableRow>
  ))
}

export const UserTableFooter: React.FC = () => {
  const { data, isLoading, handlePagination } = useUserTable()
  if (isLoading || !data?.pagination) return null

  const { page, totalPages } = data.pagination

  return (
    <TableRow>
      <TableCell colSpan={8}>
        <div className='flex items-center justify-end gap-4'>
          <Button
            variant='outline'
            size='sm'
            disabled={page <= 1}
            onClick={() => handlePagination(page - 1)}
          >
            <ChevronLeftIcon />
            <span className='sr-only'>Previous</span>
          </Button>
          <span>
            Page {page} of {totalPages}
          </span>
          <Button
            variant='outline'
            size='sm'
            disabled={page >= totalPages}
            onClick={() => handlePagination(page + 1)}
          >
            <ChevronRightIcon />
            <span className='sr-only'>Next</span>
          </Button>
        </div>
      </TableCell>
    </TableRow>
  )
}
//#endregion

//#region edit user modal component
const EditUserModal: React.FC<{
  user: RouterOutputs['user']['all']['users'][number]
}> = ({ user }) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const { updateUser } = useUserTable()

  const form = useForm({
    defaultValues: {
      userId: user.id,
      role: user.role,
      status: user.status,
      password: undefined as string | undefined,
    },
    schema: UserValidator.updateUserBody,
    onSubmit: updateUser,
    onSuccess: () => {
      setIsOpen(false)
      form.setValue('password', '')
    },
  })

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant='outline' size='sm'>
          Edit
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit User #{user.id}</DialogTitle>
          <DialogDescription>
            Here you can edit the user details.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit}>
          <FieldSet>
            <form.Field
              name='role'
              render={({ meta, field }) => (
                <Field data-invalid={meta.errors.length > 0}>
                  <FieldLabel htmlFor={meta.fieldId}>Role</FieldLabel>
                  <Select {...field}>
                    <SelectOption value=''>Select a role</SelectOption>
                    {UserValidator.roles.map((role) => (
                      <SelectOption key={role} value={role}>
                        {role.replace(/_/g, ' ')}
                      </SelectOption>
                    ))}
                  </Select>
                  <FieldError id={meta.errorId} errors={meta.errors} />
                </Field>
              )}
            />

            <form.Field
              name='status'
              render={({ meta, field }) => (
                <Field>
                  <FieldLabel htmlFor={meta.fieldId}>Status</FieldLabel>
                  <RadioGroup
                    className='grid grid-cols-2 gap-4'
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    {UserValidator.statuses.map((status) => (
                      <div key={status} className='flex items-center gap-3'>
                        <RadioGroupItem id={status} value={status} />
                        <FieldLabel htmlFor={status} className='capitalize'>
                          {status}
                        </FieldLabel>
                      </div>
                    ))}
                  </RadioGroup>
                </Field>
              )}
            />

            <form.Field
              name='password'
              render={({ meta, field }) => (
                <Field data-invalid={meta.errors.length > 0}>
                  <FieldLabel htmlFor={meta.fieldId}>Password</FieldLabel>
                  <Input
                    {...field}
                    type='password'
                    placeholder='Enter new password'
                  />
                  <FieldDescription id={meta.descriptionId}>
                    Leave blank to keep the current password.
                  </FieldDescription>
                  <FieldError id={meta.errorId} errors={meta.errors} />
                </Field>
              )}
            />

            <DialogFooter>
              <DialogClose asChild>
                <Button type='button' variant='secondary'>
                  Cancel
                </Button>
              </DialogClose>
              <Button type='submit' disabled={form.state.isPending}>
                Save Changes
              </Button>
            </DialogFooter>
          </FieldSet>
        </form>
      </DialogContent>
    </Dialog>
  )
}
//#endregion

//#region delete user modal
export const DeleteUserModal: React.FC<{
  user: RouterOutputs['user']['all']['users'][number]
}> = ({ user }) => {
  const { deleteUser, isDeleting } = useUserTable()

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='destructive' size='sm'>
          Delete
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete User: {user.username}</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this user? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant='secondary'>Cancel</Button>
          </DialogClose>
          <Button
            variant='destructive'
            onClick={() => {
              deleteUser({ userId: user.id })
            }}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
