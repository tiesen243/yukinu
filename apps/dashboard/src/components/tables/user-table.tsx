import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { parseAsInteger, parseAsString, useQueryStates } from 'nuqs'

import type { RouterOutputs } from '@yukinu/api'
import { Badge } from '@yukinu/ui/badge'
import { Button } from '@yukinu/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@yukinu/ui/dialog'
import { Field, FieldError, FieldLabel, FieldSet } from '@yukinu/ui/field'
import { useForm } from '@yukinu/ui/hooks/use-form'
import { ChevronLeftIcon, ChevronRightIcon } from '@yukinu/ui/icons'
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
import { UserModel } from '@yukinu/validators/user'

import { useTRPC, useTRPCClient } from '@/trpc/react'

const queryParsers = {
  search: parseAsString.withDefault(''),
  page: parseAsInteger.withDefault(1),
  limit: parseAsInteger.withDefault(10),
}

export const UserTable: React.FC = () => (
  <Table>
    <UserTableHeader />

    <TableBody>
      <UserTableBody />
    </TableBody>

    <TableFooter>
      <UserTableFooter />
    </TableFooter>
  </Table>
)

const UserTableHeader: React.FC = () => (
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
)

const UserTableBody: React.FC = () => {
  const [query] = useQueryStates(queryParsers)
  const trpc = useTRPC()
  const { data, isLoading } = useQuery(trpc.user.getUsers.queryOptions(query))

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
          No customers found.
        </TableCell>
      </TableRow>
    )

  return data.users.map((user) => <UserTableRow key={user.id} user={user} />)
}

const UserTableRow: React.FC<{
  user: RouterOutputs['user']['getUsers']['users'][number]
}> = ({ user }) => (
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
      <EditUserButton userId={user.id} />
      <Button
        variant='ghost'
        size='sm'
        className='text-destructive hover:bg-destructive/10 hover:text-destructive dark:hover:bg-destructive/10'
      >
        Delete
      </Button>
    </TableCell>
  </TableRow>
)

export const UserTableFooter: React.FC = () => {
  const [query, setQuery] = useQueryStates(queryParsers)
  const trpc = useTRPC()

  const { data, isLoading } = useQuery(trpc.user.getUsers.queryOptions(query))
  const handlePagination = async (newPage: number) => {
    await setQuery({ ...query, page: newPage })
  }

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

const EditUserButton: React.FC<{ userId: string }> = ({ userId }) => {
  const [query] = useQueryStates(queryParsers)
  const [isOpen, setIsOpen] = useState(false)
  const queryClient = useQueryClient()
  const trpcClient = useTRPCClient()
  const trpc = useTRPC()

  const form = useForm({
    defaultValues: { userId, role: 'user', status: 'active' },
    schema: UserModel.updateUserBody,
    onSubmit: trpcClient.user.update.mutate,
    onError: (error) => toast.error(error.message),
    onSuccess: () => {
      void queryClient.invalidateQueries(trpc.user.getUsers.queryFilter(query))
      toast.success('User role updated successfully')
      setIsOpen(false)
    },
  })

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant='ghost' size='sm'>
          Edit
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Customer {userId}</DialogTitle>
          <DialogDescription>
            Here you can edit the customer details.
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
                    <SelectOption value='admin'>Admin</SelectOption>
                    <SelectOption value='manager'>Manager</SelectOption>
                    <SelectOption value='vendor'>Vendor</SelectOption>
                    <SelectOption value='user'>User</SelectOption>
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
                    <div className='flex items-center gap-3'>
                      <RadioGroupItem id='active' value='active' />
                      <FieldLabel htmlFor='active'>Active</FieldLabel>
                    </div>
                    <div className='flex items-center gap-3'>
                      <RadioGroupItem id='inactive' value='inactive' />
                      <FieldLabel htmlFor='inactive'>Inactive</FieldLabel>
                    </div>
                  </RadioGroup>
                </Field>
              )}
            />

            <Field>
              <Button type='submit' disabled={form.state.isPending}>
                Save Changes
              </Button>
            </Field>
          </FieldSet>
        </form>
      </DialogContent>
    </Dialog>
  )
}
