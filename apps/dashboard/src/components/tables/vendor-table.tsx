import * as React from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { parseAsInteger, parseAsStringLiteral, useQueryStates } from 'nuqs'

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
import { Field, FieldLabel } from '@yukinu/ui/field'
import { useForm } from '@yukinu/ui/hooks/use-form'
import { RadioGroup, RadioGroupItem } from '@yukinu/ui/radio-group'
import { toast } from '@yukinu/ui/sonner'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@yukinu/ui/table'
import { VendorValidator } from '@yukinu/validators/vendor'

import { useTRPC } from '@/trpc/react'

export function useVendorTable() {
  const trpc = useTRPC()

  const [query, setQuery] = useQueryStates({
    status: parseAsStringLiteral(VendorValidator.vendorStatus),
    page: parseAsInteger.withDefault(1),
    limit: parseAsInteger.withDefault(10),
  })

  const { data, isLoading, refetch } = useQuery(
    trpc.vendor.all.queryOptions({
      ...query,
      status: query.status ?? undefined,
    }),
  )

  const { mutateAsync: updateVendor } = useMutation({
    ...trpc.vendor.update.mutationOptions(),
    onError: (error) => toast.error(error.message),
    onSuccess: () => {
      void refetch()
      toast.success('Vendor updated successfully')
    },
  })

  const { mutate: deleteVendor, isPending: isDeleting } = useMutation({
    ...trpc.vendor.delete.mutationOptions(),
    onError: (error) => toast.error(error.message),
    onSuccess: () => {
      void refetch()
      toast.success('Vendor deleted successfully')
    },
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
    updateVendor,
    deleteVendor,
    isDeleting,
  }
}

export const VendorTable: React.FC = () => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Owner</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Created At</TableHead>
          <TableHead>Updated At</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        <VendorTableBody />
      </TableBody>
    </Table>
  )
}

const VendorTableBody: React.FC = () => {
  const { query, data, isLoading } = useVendorTable()

  if (isLoading)
    return Array.from({ length: query.limit }, (_, index) => (
      <TableRow key={index}>
        {Array.from({ length: 6 }, (_, index) => (
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
      <TableCell>{vendor.name}</TableCell>
      <TableCell>{vendor.owner}</TableCell>
      <TableCell>
        <Badge variant={statusMap[vendor.status]}>{vendor.status}</Badge>
      </TableCell>
      <TableCell>{vendor.createdAt.toDateString()}</TableCell>
      <TableCell>{vendor.updatedAt.toDateString()}</TableCell>
      <TableCell className='space-x-4'>
        <EditVendorModal vendor={vendor} />
        <DeleteVendorModal vendor={vendor} />
      </TableCell>
    </TableRow>
  ))
}

export const EditVendorModal: React.FC<{
  vendor: RouterOutputs['vendor']['all']['vendors'][number]
}> = ({ vendor }) => {
  const { updateVendor } = useVendorTable()
  const [open, setOpen] = React.useState(false)
  const form = useForm({
    defaultValues: { vendorId: vendor.id, status: vendor.status },
    schema: VendorValidator.updateBody,
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
                onValueChange={field.onChange}
                className='grid grid-cols-3 gap-4'
              >
                {VendorValidator.vendorStatus.map((status) => (
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

export const DeleteVendorModal: React.FC<{
  vendor: RouterOutputs['vendor']['all']['vendors'][number]
}> = ({ vendor }) => {
  const { deleteVendor, isDeleting } = useVendorTable()

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
              deleteVendor({ vendorId: vendor.id })
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
