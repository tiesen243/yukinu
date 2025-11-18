import * as React from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { parseAsInteger, parseAsStringLiteral, useQueryStates } from 'nuqs'

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
import { Field, FieldLabel } from '@yukinu/ui/field'
import { useForm } from '@yukinu/ui/hooks/use-form'
import { ChevronLeftIcon, ChevronRightIcon } from '@yukinu/ui/icons'
import { RadioGroup, RadioGroupItem } from '@yukinu/ui/radio-group'
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
import { VendorModels } from '@yukinu/validators/vendor'

import { useTRPC } from '@/trpc/react'

function useVendorTable() {
  const trpc = useTRPC()

  const [query, setQuery] = useQueryStates({
    status: parseAsStringLiteral(VendorModels.statuses),
    page: parseAsInteger.withDefault(1),
    limit: parseAsInteger.withDefault(10),
  })

  const { data, isLoading } = useQuery(
    trpc.vendor.all.queryOptions({
      ...query,
      status: query.status ?? undefined,
    }),
  )

  const { mutateAsync: update } = useMutation({
    ...trpc.vendor.update.mutationOptions(),
    onSuccess: () => toast.success('Vendor updated successfully'),
    onError: (error) => toast.error(error.message),
    meta: { filter: trpc.vendor.all.queryFilter() },
  })

  const { mutate: remove, isPending: isRemoving } = useMutation({
    ...trpc.vendor.delete.mutationOptions(),
    onSuccess: () => toast.success('Vendor deleted successfully'),
    onError: (error) => toast.error(error.message),
    meta: { filter: trpc.vendor.all.queryFilter() },
  })

  const handlePagination = React.useCallback(
    async (newPage: number) => setQuery({ ...query, page: newPage }),
    [query, setQuery],
  )

  return {
    query,
    data,
    isLoading,
    handlePagination,
    update,
    remove,
    isRemoving,
  }
}

export const VendorTable: React.FC = () => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className='w-52'>ID</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Owner</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Updated At</TableHead>
          <TableHead className='min-w-32'>Actions</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        <VendorTableBody />
      </TableBody>

      <TableFooter>
        <VendorTableFooter />
      </TableFooter>
    </Table>
  )
}

const VendorTableBody: React.FC = () => {
  const { query, data, isLoading } = useVendorTable()

  if (isLoading)
    return Array.from({ length: query.limit }, (_, index) => (
      <TableRow key={index}>
        {Array.from({ length: 7 }, (_, index) => (
          <TableCell key={index}>
            <div className='animate-pulse rounded-sm bg-accent'>&nbsp;</div>
          </TableCell>
        ))}
      </TableRow>
    ))

  const statusMap = {
    pending: 'warning',
    approved: 'success',
    suspended: 'destructive',
  } as const

  return data?.vendors.map((vendor) => (
    <TableRow key={vendor.id}>
      <TableCell>{vendor.id}</TableCell>
      <TableCell>{vendor.name}</TableCell>
      <TableCell>{vendor.owner}</TableCell>
      <TableCell>
        <Badge variant={statusMap[vendor.status]}>{vendor.status}</Badge>
      </TableCell>
      <TableCell>{vendor.updatedAt.toDateString()}</TableCell>
      <TableCell className='space-x-4'>
        <EditVendorModal vendor={vendor} />
        <DeleteVendorModal vendor={vendor} />
      </TableCell>
    </TableRow>
  ))
}

const VendorTableFooter: React.FC = () => {
  const { data, isLoading, handlePagination } = useVendorTable()
  if (isLoading || !data?.pagination) return null

  const { page, totalPages } = data.pagination

  return (
    <TableRow>
      <TableCell colSpan={6}>
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

const EditVendorModal: React.FC<{
  vendor: VendorModels.AllOutput['vendors'][number]
}> = ({ vendor }) => {
  const { update: updateVendor } = useVendorTable()
  const [open, setOpen] = React.useState(false)
  const form = useForm({
    defaultValues: { id: vendor.id, status: vendor.status },
    schema: VendorModels.updateInput.pick({ id: true, status: true }),
    onSubmit: updateVendor,
    onSuccess: () => {
      setOpen(false)
    },
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='outline' size='sm'>
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Vendor: {vendor.name}</DialogTitle>
          <DialogDescription>
            Here you can edit the vendor details and update its status.
          </DialogDescription>
        </DialogHeader>

        <form.Field
          name='status'
          render={({ meta, field }) => (
            <Field data-invalid={meta.errors.length > 0}>
              <RadioGroup
                id={field.id}
                value={field.value}
                onValueChange={field.onChange as (value: string) => void}
                className='grid grid-cols-3 gap-4'
              >
                {VendorModels.statuses.map((status) => (
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

        <DialogFooter>
          <DialogClose asChild>
            <Button type='button' variant='secondary'>
              Cancel
            </Button>
          </DialogClose>
          <Button onClick={form.handleSubmit} disabled={form.state.isPending}>
            {form.state.isPending ? 'Updating...' : 'Update Vendor'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

const DeleteVendorModal: React.FC<{
  vendor: VendorModels.AllOutput['vendors'][number]
}> = ({ vendor }) => {
  const { remove: deleteVendor, isRemoving: isDeleting } = useVendorTable()

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='destructive' size='sm'>
          Delete
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Vendor: {vendor.name}</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this vendor? This action cannot be
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
              deleteVendor(vendor)
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
