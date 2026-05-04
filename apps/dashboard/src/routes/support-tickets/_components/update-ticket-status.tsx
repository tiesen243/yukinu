import type { TicketEntity } from '@yukinu/api/identity'

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

export const UpdateTicketStatus: React.FC<{
  ticketId: string
  currentStatus: TicketEntity['status']
}> = ({ ticketId, currentStatus }) => {
  const [status, setStatus] = useState(currentStatus)
  const [isOpen, setIsOpen] = useState(false)

  const { trpc } = useTRPC()
  const updateStatus = useMutation({
    ...trpc.identity.ticket.updateStatus.mutationOptions(),
    meta: { filter: trpc.identity.ticket.all.queryFilter() },
    onSuccess: () => [
      toast.success({ message: 'Ticket status updated successfully' }),
      setIsOpen(false),
    ],
    onError: ({ message }) => toast.error({ message }),
  })

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger render={<Button />}>Update Status</DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Ticket Status</DialogTitle>
        </DialogHeader>

        <RadioGroup value={status} onValueChange={setStatus}>
          {statuses.map((_status) => (
            <FieldLabel
              key={_status.value}
              htmlFor={`${ticketId}-${_status.value}`}
            >
              <Field orientation='horizontal'>
                <FieldContent>
                  <FieldTitle>{_status.label}</FieldTitle>
                  <FieldDescription>{_status.description}</FieldDescription>
                </FieldContent>
                <RadioGroupItem
                  value={_status.value}
                  id={`${ticketId}-${_status.value}`}
                />
              </Field>
            </FieldLabel>
          ))}
        </RadioGroup>

        <DialogFooter>
          <DialogClose
            render={<Button variant='outline' />}
            disabled={updateStatus.isPending}
          >
            Cancel
          </DialogClose>
          <Button
            onClick={() => updateStatus.mutate({ id: ticketId, status })}
            disabled={updateStatus.isPending}
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
    value: 'open',
    label: 'Open',
    description: 'The ticket is open and awaiting response.',
  },
  {
    value: 'resolved',
    label: 'Resolved',
    description: 'The issue has been resolved.',
  },
  {
    value: 'closed',
    label: 'Closed',
    description: 'The ticket is closed and no further action is needed.',
  },
] as const
