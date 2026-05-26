import type { OrderEntity } from '@yukinu/api/checkout'

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

export const UpdateStatus: React.FC<{
  orderId: number
  currentStatus: OrderEntity.Status
  disabled: boolean
}> = ({ orderId, currentStatus, disabled }) => {
  const { trpc } = useTRPC()

  const [status, setStatus] = useState(currentStatus)
  const [isOpen, setIsOpen] = useState(false)

  const { mutate, isPending } = useMutation({
    ...trpc.checkout.order.updateStatus.mutationOptions(),
    meta: {
      filter: trpc.checkout.order.oneForVendor.queryFilter({ id: orderId }),
    },
    onSuccess: () => {
      toast.success({ message: 'Order status updated successfully!' })
      setIsOpen(false)
    },
    onError: ({ message }) => toast.error({ message }),
  })

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger render={<Button />} disabled={disabled}>
        Update Status
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Order #{orderId} Status</DialogTitle>
        </DialogHeader>

        <RadioGroup value={status} onValueChange={setStatus}>
          {statuses.map((_status) => (
            <FieldLabel htmlFor={`${_status.value}-field`} key={_status.value}>
              <Field orientation='horizontal'>
                <FieldContent>
                  <FieldTitle>{_status.label}</FieldTitle>
                  <FieldDescription>{_status.description}</FieldDescription>
                </FieldContent>
                <RadioGroupItem
                  value={_status.value}
                  id={`${_status.value}-field`}
                />
              </Field>
            </FieldLabel>
          ))}
        </RadioGroup>

        <DialogFooter>
          <DialogClose
            render={<Button variant='outline' />}
            disabled={isPending}
          >
            Cancel
          </DialogClose>

          <Button
            onClick={() => mutate({ id: orderId, status })}
            disabled={isPending}
          >
            Save Changes
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
    description: 'Order is pending and awaiting processing.',
  },
  {
    value: 'confirmed',
    label: 'Confirmed',
    description: 'Order has been confirmed and is being prepared.',
  },
  {
    value: 'shipped',
    label: 'Shipped',
    description: 'Order has been handed over to the courier and is on its way.',
  },
  // oxlint-disable-next-line no-warning-comments
  // TODO: Automate this state transition later by integrating shipping carrier APIs & Webhooks
  {
    value: 'delivered',
    label: 'Delivered',
    description:
      'Courier reports the order has been successfully delivered to the customer.',
  },
  {
    value: 'completed',
    label: 'Completed',
    description: 'Order is fully completed, funds released to vendor.',
  },
  {
    value: 'cancelled',
    label: 'Cancelled',
    description: 'Order has been cancelled.',
  },
]
