import { useQuery } from '@tanstack/react-query'
import { parseAsInteger, parseAsString, useQueryStates } from 'nuqs'

import type { RouterInputs, RouterOutputs } from '@yukinu/api'
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

export const CustomersTable: React.FC = () => {
  const [query, setQuery] = useQueryStates({
    search: parseAsString.withDefault(''),
    page: parseAsInteger.withDefault(1),
    limit: parseAsInteger.withDefault(10),
  })

  const handlePagination = async (page: number) => {
    await setQuery({ page })
  }

  return (
    <Table>
      <CustomersTableHeader />

      <TableBody>
        <CustomersTableBody query={query} />
      </TableBody>

      <TableFooter>
        <CustomersTableFooter
          query={query}
          handlePagination={handlePagination}
        />
      </TableFooter>
    </Table>
  )
}

const CustomersTableHeader: React.FC = () => (
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

const CustomersTableBody: React.FC<{
  query: RouterInputs['user']['getUsers']
}> = ({ query }) => {
  const trpc = useTRPC()
  const { data, isLoading } = useQuery(trpc.user.getUsers.queryOptions(query))

  if (isLoading)
    return Array.from({ length: 10 }, (_, index) => (
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

  return data.users.map((user) => (
    <CustomersTableRow key={user.id} user={user} />
  ))
}

const CustomersTableRow: React.FC<{
  user: RouterOutputs['user']['getUsers']['users'][number]
}> = ({ user }) => (
  <TableRow key={user.id}>
    <TableCell>{user.id}</TableCell>
    <TableCell>{user.username}</TableCell>
    <TableCell>{user.email}</TableCell>
    <TableCell>{user.role}</TableCell>
    <TableCell>{user.status}</TableCell>
    <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
    <TableCell>{new Date(user.updatedAt).toLocaleDateString()}</TableCell>
    <TableCell className='flex w-fit items-center gap-2'>
      <EditCustomerButton userId={user.id} />
      <Button
        variant='ghost'
        size='sm'
        className='text-warning hover:bg-warning/10 hover:text-warning dark:hover:bg-warning/10'
      >
        Suspend
      </Button>
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

export const CustomersTableFooter: React.FC<{
  query: RouterInputs['user']['getUsers']
  handlePagination: (page: number) => void
}> = ({ query, handlePagination }) => {
  const trpc = useTRPC()
  const { data, isLoading } = useQuery(trpc.user.getUsers.queryOptions(query))

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
            onClick={() => {
              handlePagination(page - 1)
            }}
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
            onClick={() => {
              handlePagination(page + 1)
            }}
          >
            <ChevronRightIcon />
            <span className='sr-only'>Next</span>
          </Button>
        </div>
      </TableCell>
    </TableRow>
  )
}

const EditCustomerButton: React.FC<{
  userId: string
}> = ({ userId }) => {
  const trpc = useTRPCClient()

  const form = useForm({
    defaultValues: { userId, role: 'user' },
    schema: UserModel.updateUserRoleBody,
    onSubmit: trpc.user.updateRole.mutate,
    onError: (error) => toast.error(error.message),
    onSuccess: () => toast.success('User role updated successfully'),
  })

  return (
    <Dialog>
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
