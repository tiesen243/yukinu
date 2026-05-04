import type { VendorEntity } from '@yukinu/api/merchant'

import { useMutation } from '@tanstack/react-query'
import { Button } from '@yukinu/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@yukinu/ui/dialog'
import {
  FieldLabel,
  Field,
  FieldContent,
  FieldTitle,
  FieldDescription,
} from '@yukinu/ui/field'
import { RadioGroup, RadioGroupItem } from '@yukinu/ui/radio-group'
import { toast } from '@yukinu/ui/toast'
import { useState } from 'react'

import { useTRPC } from '@/lib/trpc'

export const UpdateVendorButton: React.FC<{
  vendorId: string
  vendorOwnerId: string | null
  vendorName: string
  vendorStatus: VendorEntity.Status
}> = ({ vendorId, vendorOwnerId, vendorName, vendorStatus }) => {
  const { trpc } = useTRPC()
  const [isOpen, setIsOpen] = useState(false)
  const [status, setStatus] = useState(vendorStatus)

  const updateVendor = useMutation({
    ...trpc.merchant.vendor.updateStatus.mutationOptions(),
    meta: { filter: trpc.merchant.vendor.all.queryFilter() },
    onSuccess: () => [
      setIsOpen(false),
      toast.success({
        message: `Vendor ${vendorName} status updated successfully`,
      }),
    ],
    onError: ({ message }) => toast.error({ message }),
  })

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger render={<Button />}>Edit</DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Vendor {vendorName} Status</DialogTitle>
        </DialogHeader>

        <RadioGroup
          value={status}
          onValueChange={setStatus}
          aria-describedby={`${vendorId}-status`}
        >
          {statuses.map((_status) => (
            <FieldLabel
              htmlFor={`${vendorId}-${_status.value}`}
              key={_status.value}
            >
              <Field orientation='horizontal'>
                <FieldContent>
                  <FieldTitle>{_status.label}</FieldTitle>
                  <FieldDescription>{_status.description}</FieldDescription>
                </FieldContent>
                <RadioGroupItem
                  value={_status.value}
                  id={`${vendorId}-${_status.value}`}
                />
              </Field>
            </FieldLabel>
          ))}
        </RadioGroup>

        <DialogFooter>
          <DialogClose disabled={updateVendor.isPending}>Cancel</DialogClose>
          <Button
            onClick={() =>
              updateVendor.mutate({
                id: vendorId,
                ownerId: vendorOwnerId,
                status,
              })
            }
            disabled={updateVendor.isPending || !status}
          >
            Update
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

const statuses = [
  {
    value: 'pending',
    label: 'Pending',
    description: 'Vendor registration is pending review.',
  },
  {
    value: 'rejected',
    label: 'Rejected',
    description: 'Vendor registration has been rejected.',
  },
  {
    value: 'approved',
    label: 'Approved',
    description: 'Vendor registration has been approved.',
  },
  {
    value: 'suspended',
    label: 'Suspended',
    description: 'Vendor account is suspended due to policy violations.',
  },
]
