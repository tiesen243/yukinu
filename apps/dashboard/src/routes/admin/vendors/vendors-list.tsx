import { useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'

import { cn } from '@yukinu/ui'
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
import { Label } from '@yukinu/ui/label'
import { RadioGroup, RadioGroupItem } from '@yukinu/ui/radio-group'
import { toast } from '@yukinu/ui/sonner'
import { TableCell, TableRow } from '@yukinu/ui/table'
import { VendorValidators } from '@yukinu/validators/vendor'

import { useTRPC } from '@/lib/trpc/react'
import { useVendorQueryStates } from '@/routes/admin/vendors/hook'

export const VendorsList: React.FC = () => {
  const trpc = useTRPC()
  const [query] = useVendorQueryStates()

  const { data, isLoading } = useQuery(trpc.vendor.all.queryOptions(query))

  if (isLoading)
    return Array.from({ length: 5 }, (_, index) => (
      <TableRow key={index}>
        {Array.from({ length: 8 }, (_, cellIndex) => (
          <TableCell key={cellIndex}>
            <div className='animate-pulse rounded bg-muted/50'>&nbsp;</div>
          </TableCell>
        ))}
      </TableRow>
    ))

  const statusVariantMap = {
    approved: 'success',
    pending: 'warning',
    suspended: 'destructive',
  } as const

  return data?.vendors.map((vendor) => (
    <TableRow key={vendor.id}>
      <TableCell>{vendor.id}</TableCell>
      <TableCell>{vendor.name}</TableCell>
      <TableCell>{vendor.owner.username}</TableCell>
      <TableCell>{vendor.staffCount}</TableCell>
      <TableCell>
        <Badge variant={statusVariantMap[vendor.status]}>{vendor.status}</Badge>
      </TableCell>
      <TableCell>{vendor.createdAt.toLocaleDateString()}</TableCell>
      <TableCell>{vendor.updatedAt.toLocaleDateString()}</TableCell>
      <TableCell>
        <EditVendorButton vendor={vendor} />
      </TableCell>
    </TableRow>
  ))
}

const EditVendorButton: React.FC<{
  vendor: VendorValidators.AllOutput['vendors'][number]
}> = ({ vendor }) => {
  const trpc = useTRPC()
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState(vendor.status)

  const { mutate, isPending } = useMutation({
    ...trpc.vendor.updateStatus.mutationOptions(),
    onSuccess: () => {
      toast.success('Vendor status updated successfully')
      setOpen(false)
    },
    onError: ({ message }) =>
      toast.error('Failed to update vendor status', { description: message }),
    meta: { filter: trpc.vendor.all.queryFilter() },
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className='text-primary underline-offset-4 hover:underline'>
        Edit Status
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Vendor Status: {vendor.name}</DialogTitle>
          <DialogDescription>
            Change the status of this vendor as needed.
          </DialogDescription>
        </DialogHeader>

        <RadioGroup value={status} onValueChange={setStatus as never}>
          {VendorValidators.statuses.map((status) => (
            <Label
              key={status}
              htmlFor={status}
              className={cn(
                'flex cursor-pointer items-center space-x-2 rounded-md border border-current/40 bg-current/5 px-2 py-4 capitalize transition-colors hover:bg-current/10',
                {
                  'text-success': status === 'approved',
                  'text-warning': status === 'pending',
                  'text-destructive': status === 'suspended',
                },
              )}
            >
              <RadioGroupItem id={status} value={status} />
              {status}
            </Label>
          ))}
        </RadioGroup>

        <DialogFooter>
          <DialogClose
            render={
              <Button variant='outline' disabled={isPending}>
                Cancel
              </Button>
            }
          />
          <Button
            onClick={() => {
              mutate({ id: vendor.id, status })
            }}
            disabled={isPending || status === vendor.status}
          >
            {isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
