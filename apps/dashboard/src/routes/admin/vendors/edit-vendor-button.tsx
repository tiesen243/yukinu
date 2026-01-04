import { useMutation } from '@tanstack/react-query'
import { cn } from '@yukinu/ui'
import { Button } from '@yukinu/ui/button'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@yukinu/ui/dialog'
import { Label } from '@yukinu/ui/label'
import { RadioGroup, RadioGroupItem } from '@yukinu/ui/radio-group'
import { toast } from '@yukinu/ui/sonner'
import {
  vendorStatuses,
  type AllVendorsOutput,
} from '@yukinu/validators/vendor'
import { useState } from 'react'

import { useTRPC } from '@/lib/trpc/react'

export const EditVendorButton: React.FC<{
  vendor: AllVendorsOutput['vendors'][number]
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
      <DialogTrigger variant='link'>Edit Status</DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Vendor Status: {vendor.name}</DialogTitle>
          <DialogDescription>
            Change the status of this vendor as needed.
          </DialogDescription>
        </DialogHeader>

        <RadioGroup value={status} onValueChange={setStatus as never}>
          {vendorStatuses.map((status) => (
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
          <DialogClose disabled={isPending}>Cancel</DialogClose>
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
